"use client";
import React, { useEffect, useState } from "react";

// Utility function to detect browser type only

const PlaygroundPage = () => {
//   const [browserType, setBrowserType] = useState<string | null>(null);
//   const [userAgent, setUserAgent] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       const ua = navigator.userAgent;
//       setUserAgent(ua);
//       setBrowserType(getBrowserType(ua));
//     } catch (err: any) {
//       setError(err.message);
//     }
//   }, []);

  return (
    <div className="mt-[200px] container mx-auto">
      {/* <h1>Browser Type Playground</h1>
      {error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : browserType !== null ? (
        <div>
          <p>
            <strong>Browser Type:</strong>{" "}
            {browserType}
          </p>
          <details className="mt-3">
            <summary className="cursor-pointer text-blue-600 underline">
              Show raw User Agent
            </summary>
            <pre className="whitespace-pre-wrap mt-2">{userAgent}</pre>
          </details>
        </div>
      ) : (
        <p>Detecting browser type...</p>
      )} */}
    </div>
  );
};

export default PlaygroundPage;