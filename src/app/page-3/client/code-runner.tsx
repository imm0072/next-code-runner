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
      const response = await axios.post("http://10.1.2.48:5000/run", { language, code });
      setOutput(response.data.error || response.data.output);
    } catch (error) {
      setOutput("Error executing code");
    }
    setIsRunning(false);
  };

  const fixCode = async () => {
    setIsFixing(true);
    setOutput("");
    setReason("");

    try {
      const response = await axios.post("http://10.1.2.48:5000/openai/correct", { language, code });
      
      if (response.data.correctedCode) {
        const match = response.data.correctedCode.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
          const correctedData = JSON.parse(match[1]);
          setCode(correctedData.output || "");
          setReason(correctedData.error || "No error description");
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 text-white shadow-xl rounded-lg max-w-4xl w-full p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Online Code Runner</h2>
        
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-300">Language:</label>
          <select
            className="w-full p-2 mt-2 rounded bg-gray-700 text-white border border-gray-500"
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
          className="w-full p-4 bg-gray-950 text-green-400 font-mono border border-gray-700 rounded-md focus:outline-none"
          rows={8}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
        />

        <div className="flex space-x-4 mt-4">
          <button
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-indigo-700 transition"
            onClick={runCode}
            disabled={isRunning || isFixing}
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
          <button
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-700 transition"
            onClick={fixCode}
            disabled={isRunning || isFixing}
          >
            {isFixing ? "Fixing..." : "Fix Code"}
          </button>
        </div>

        {reason && (
          <div className="mt-4 p-4 bg-yellow-700 text-yellow-200 rounded-lg">
            <strong>Fix Reason:</strong> {reason}
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-2">Output:</h3>
          <pre className="bg-black text-green-400 p-4 rounded-lg min-h-[100px] overflow-auto">
            {output || "No output yet..."}
          </pre>
        </div>
      </div>
    </div>
  );
}