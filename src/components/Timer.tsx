"use client"

import React from 'react';
import { useLLM } from "@/components/contexts/llm/LLMContext";

export default function Timer() {
    // Pull the state directly from the "Brain" (LLMProvider)
    const { 
        secondsLeft, 
        isTimerActive, 
        startTimer, 
        pauseTimer 
    } = useLLM();

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-neutral-900/50 border-neutral-800">
            <h2 className={`text-3xl font-mono ${secondsLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
            </h2>

            <button 
                onClick={isTimerActive ? pauseTimer : startTimer}
                className={`w-full px-4 py-2 rounded-md transition-colors ${
                    isTimerActive 
                        ? 'bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
                {isTimerActive ? 'Pause Interview' : 'Start Interview'}
            </button>
            
            {secondsLeft === 0 && (
                <p className="text-xs text-red-400 font-semibold uppercase tracking-tighter">
                    Interview Concluded
                </p>
            )}
        </div>
    );
}