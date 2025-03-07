"use client";
import { useEffect } from "react";

const PopupPage = () => {
  useEffect(() => {
    const sendDataToParent = () => {
      window.opener?.postMessage(
        { message: "Hello from Popup!", timestamp: Date.now() },
        "http://localhost:3000/page-2" // Make sure this matches the parent URL
      );
    };

    // Send data every 3 seconds (for demo purposes)
    const interval = setInterval(sendDataToParent, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Popup Window</h1>
      <p>This window is sending data to the parent every 3 seconds.</p>
    </div>
  );
};

export default PopupPage;
