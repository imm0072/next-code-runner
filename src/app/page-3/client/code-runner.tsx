"use client";
import { useState } from "react";
import axios from "axios";

export default function CodeRunner() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [reason, setReason] = useState("");
  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setReason("");

    try {
      const response = await axios.post("http://10.1.2.48:5000/run", {
        language,
        code,
      });
      if (response.data.error) {
        setOutput(response.data.error);
      } else {
        setOutput(response.data.output);
      }
    } catch (error) {
      setOutput("Error executing code");
    }
    setIsRunning(false);
  };

  const fixCode = async () => {
    setIsFixing(true);
    setOutput("");
  
    try {
      const response = await axios.post(
        "http://10.1.2.48:5000/openai/correct",
        { language, code }
      );
  
      if (response.data.correctedCode) {
        // Extract JSON content from Markdown block
        const jsonMatch = response.data.correctedCode.match(/```json\n([\s\S]*?)\n```/);
  
        if (jsonMatch && jsonMatch[1]) {
          const correctedData = JSON.parse(jsonMatch[1]); // Parse extracted JSON
  
          setCode(correctedData.output || ""); // Set corrected code
          setReason(correctedData.error || ""); // Set reason if exists
        } else {
          setOutput("Invalid response format");
        }
      } else {
        setOutput(response.data.error || "Error correcting code");
      }
    } catch (error) {
      setOutput("Error correcting code");
    }
  
    setIsFixing(false);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg max-w-4xl w-full p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Online Code Runner
        </h2>
        <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
          <label className="w-full md:w-auto text-lg font-medium text-gray-700">
            Language:
          </label>
          <select
            className="w-full md:w-auto p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
          >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
          </select>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-6"
          rows={8}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
        />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
            onClick={runCode}
            disabled={isRunning || isFixing}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <button
            className="w-full flex items-center justify-center bg-green-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-700 transition duration-300"
            onClick={fixCode}
            disabled={isRunning || isFixing}
          >
            {isFixing ? (
              "Fixing..."
            ) : (
              <>
                {/* AI Icon: a simple robot SVG icon */}
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C10.343 2 9 3.343 9 5v1H6c-1.657 0-3 1.343-3 3v2c0 1.657 1.343 3 3 3h3v4H5a1 1 0 000 2h14a1 1 0 000-2h-4v-4h3c1.657 0 3-1.343 3-3V9c0-1.657-1.343-3-3-3h-3V5c0-1.657-1.343-3-3-3zm-2 4c0-.552.448-1 1-1s1 .448 1 1v1h-2V6zm8 4c0 .551-.448 1-1 1h-1v-2h1c.552 0 1 .449 1 1zm-10 0c0-.551.448-1 1-1h1v2H9c-.552 0-1-.449-1-1zm8 6v4h-4v-4h4z" />
                </svg>
                Fix Code
              </>
            )}
          </button>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Output:</h3>
          {(isRunning || isFixing) && (
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          <pre className="bg-gray-100 p-4 rounded-lg text-gray-700 whitespace-pre-wrap min-h-[100px]">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
