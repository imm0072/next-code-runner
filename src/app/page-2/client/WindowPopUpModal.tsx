"use client";
import { useEffect, useState } from "react";

export const WindowPopUpModal = ({ url }: { url?: string }) => {
  const [popup, setPopup] = useState<Window | null>(null);
  const [popupData, setPopupData] = useState<any>(null);

  const openPopup = () => {
    const newPopup = window.open(
      url || "http://localhost:3000/page-1/",
      "Popup",
      "width=600,height=600"
    );

    if (newPopup) {
      setPopup(newPopup);

      // Polling to detect when the popup is closed
      const interval = setInterval(() => {
        if (newPopup.closed) {
          clearInterval(interval);
          console.log("Popup closed");
        }
      }, 500);
    }
  };

  useEffect(() => {
    if (!popup) return;

    popup.addEventListener("click", (event) => {
      console.log("Clicked:");
    });
  }, [popup]);

  useEffect(() => {
    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3000") return; // Ensure security by checking origin

      console.log("Message received from popup:", event.data);
      setPopupData(event.data); // Store received data
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div>
      <button onClick={openPopup}>Open Popup</button>
      {popupData && (
        <div>
          <h3>Popup Data:</h3>
          <pre>{JSON.stringify(popupData, null, 2)}</pre>{" "}
          {/* Display JSON data properly */}
        </div>
      )}
    </div>
  );
};
