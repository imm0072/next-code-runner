"use client";

import { useState } from "react";

interface Group {
  id: string;
  name: string;
  isLive: boolean;
}

const groups: Group[] = [
  { id: "1", name: "Tech Talk", isLive: true },
  { id: "2", name: "Gaming Hub", isLive: false },
  { id: "3", name: "Music Lovers", isLive: true },
  { id: "4", name: "Movie Buffs", isLive: false },
];

export default function GroupList() {
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);

  const handleJoin = (groupId: string) => {
    setJoinedGroup(groupId);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Join a Group Stream</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex justify-between items-center p-3 border-b last:border-none"
          >
            <div>
              <h2 className="text-lg font-semibold">{group.name}</h2>
              <p className={group.isLive ? "text-green-500" : "text-gray-500"}>
                {group.isLive ? "Live Now" : "Offline"}
              </p>
            </div>
            <button
              onClick={() => handleJoin(group.id)}
              disabled={!group.isLive || joinedGroup === group.id}
              className={`px-4 py-2 rounded-lg text-white shadow-md transition duration-200 ${
                group.isLive ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {joinedGroup === group.id ? "Joined" : "Join"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
