"use client";
import { useState, useRef, useEffect } from "react"; 
import GroupList from "./gp-list";

interface Participant {
  stream: MediaStream;
}

const useScreenSharing = () => {
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const startSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      setIsSharing(true);

      stream.getVideoTracks()[0].onended = () => stopSharing();
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const stopSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsSharing(false);
    }
  };

  return { isSharing, screenStream, startSharing, stopSharing };
};

interface ScreenShareButtonProps {
  startSharing: () => void;
  stopSharing: () => void;
  isSharing: boolean;
}

const ScreenShareButton: React.FC<ScreenShareButtonProps> = ({ startSharing, stopSharing, isSharing }) => {
  return (
    <button onClick={isSharing ? stopSharing : startSharing} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
      {isSharing ? "Stop Sharing" : "Share Screen"}
    </button>
  );
};

interface MainVideoProps {
  stream: MediaStream | null;
}

const MainVideo: React.FC<MainVideoProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl h-auto rounded-lg border-2 border-gray-300 shadow-lg" />;
};

interface ParticipantsGridProps {
  participants: Participant[];
}

const ParticipantsGrid: React.FC<ParticipantsGridProps> = ({ participants }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 w-full max-w-5xl">
      {participants.map((participant, index) => (
        <video
          key={index}
          autoPlay
          playsInline
          className="w-full h-40 md:h-60 rounded-lg border-2 border-gray-300 shadow-lg"
          ref={(el) => {
            if (el) el.srcObject = participant.stream;
          }}
        />
      ))}
    </div>
  );
};

export default function VideoCall() {
  const { isSharing, screenStream, startSharing, stopSharing } = useScreenSharing();
  const [participants, setParticipants] = useState<Participant[]>([]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Video Call</h1>
     <div className="flex gap-5">
     <GroupList/>
     <MainVideo stream={screenStream} />
     </div>
      <ScreenShareButton startSharing={startSharing} stopSharing={stopSharing} isSharing={isSharing} />
      <ParticipantsGrid participants={participants} />
    </div>
  );
}
