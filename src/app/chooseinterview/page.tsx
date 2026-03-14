"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartInterviewPage() {
  const router = useRouter();

  const [interviewType, setInterviewType] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("easy");

  const handleStart = () => {
    if (!interviewType) return;

  if (interviewType === "technical") {
    // Redirect to /interview with difficulty param
    router.push(`/interview?type=technical&difficulty=${difficulty}`);
  } else if (interviewType === "behavioural") {
    // Redirect to the new behavioural page
    router.push("/behaviour");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-6">
      <h1 className="text-3xl font-bold">Choose Your Interview</h1>

      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="interviewType"
            value="technical"
            checked={interviewType === "technical"}
            onChange={(e) => setInterviewType(e.target.value)}
          />
          Technical
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="interviewType"
            value="behavioural"
            checked={interviewType === "behavioural"}
            onChange={(e) => setInterviewType(e.target.value)}
          />
          Behavioural
        </label>
      </div>

      {interviewType === "technical" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="difficulty">Select Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      )}

      <button
        onClick={handleStart}
        className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
      >
        Start Interview
      </button>
    </div>
  );
}