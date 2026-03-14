"use client"

import React from "react"
import { ILLMContext, LLMContext } from "@/components/contexts/llm/LLMContext";
import { useChat } from "@ai-sdk/react";
import { useCode } from "@/components/contexts/code/CodeContext";

type Props = {
    children: React.ReactNode;
    onResponse: (response: string) => void;
}

export function LLMProvider(props: Readonly<Props>): React.ReactNode {
    const { code } = useCode();
    const DEFAULT_TIME = 1200; 
    
    const [secondsLeft, setSecondsLeft] = React.useState(DEFAULT_TIME); 
    const [isTimerActive, setIsTimerActive] = React.useState(false);

    // Sync signal string to avoid "sticky" history
    const TIMEOUT_SIGNAL = "__INTERRUPT_SYSTEM_TIME_UP__";


    const { messages, status, sendMessage, setMessages } = useChat({
        onFinish: ({ message: response }) => {
            const text = response.parts
                .filter(part => part.type === "text")
                .map(part => (part as any).text)
                .join(" ")
                .trim();

            if (!text) return;

            props.onResponse(text);
        }
    });

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isTimerActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isTimerActive) {
            setIsTimerActive(false);
            console.log("Time up! Triggering summary mode...");
            
            // Use a string here or your TIMEOUT_SIGNAL constant
            sendMessage(
                { text: "__INTERRUPT_SYSTEM_TIME_UP__" }, 
                { body: { currentCode: code, isTimeout: true } }
            );
        }

        return () => { if (interval) clearInterval(interval); };
    }, [isTimerActive, secondsLeft, sendMessage, code]);

    const startTimer = React.useCallback(() => {
        // Reset the clock if it's currently at 0
        if (secondsLeft <= 0) {
            setSecondsLeft(DEFAULT_TIME);
        }

        // Wipe the message history
        // This ensures the backend doesn't see the previous summary 
        // or the 'isTimeout' flag from the last session.
        setMessages([]);

        // Re-activate the interval
        setIsTimerActive(true);
        
        console.log("Session Reset: Timer restored and history cleared.");
    }, [secondsLeft, setMessages, DEFAULT_TIME]);

    const value = React.useMemo<ILLMContext>(() => ({
        messages,
        sendMessage: async (msg: string) => {
            await sendMessage({ text: msg }, { body: { currentCode: code } });
        },
        status,
        secondsLeft,
        isTimerActive,
        startTimer,
        pauseTimer: () => setIsTimerActive(false),
        resetInterview: () => {
            setMessages([]);
            setSecondsLeft(DEFAULT_TIME);
            setIsTimerActive(false);
        }
    }), [messages, sendMessage, status, secondsLeft, isTimerActive, startTimer, code, setMessages]);

    return (
        <LLMContext.Provider value={value}>
            {props.children}
        </LLMContext.Provider>
    )
}