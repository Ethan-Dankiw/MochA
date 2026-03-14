"use client"

import React from "react"
import {ILLMContext, LLMContext} from "@/components/contexts/llm/LLMContext";
import {useChat} from "@ai-sdk/react";
import {useCode} from "@/components/contexts/code/CodeContext";
import {usePathname, useSearchParams} from "next/navigation";
import {UIMessage} from "ai";
import {QuestionDifficulty} from "@/lib/types/difficulty";

type Props = {
    children: React.ReactNode;
    onResponse: (response: string) => void;
}

// Extracted helper to read messages cleanly
const readMessagesFromStorage = (storageKey: string): UIMessage[] => {
    if (globalThis === undefined) {
        return [];
    }

    try {
        const raw = globalThis.localStorage.getItem(storageKey);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function LLMProvider(props: Readonly<Props>): React.ReactNode {
    // Store the selected difficulty for questions
    const [difficulty, setDifficulty] = React.useState<QuestionDifficulty>(QuestionDifficulty.MEDIUM);

    // Get the current state of the code editor's contents
    const {code, language} = useCode()

    // Setup derived constants
    const isBehaviourPage = usePathname() === "/interview/behaviour";
    const storageKey = isBehaviourPage ? "chat_messages_behavioural_page" : "chat_messages_interview_page";

    // Memoize the initial load so it only happens once
    const initialMessages = React.useMemo(() => readMessagesFromStorage(storageKey), [storageKey]);

    const {messages, sendMessage, status} = useChat({
        id: storageKey,
        messages: initialMessages,
        onFinish: ({message: response}) => {
            // Convert the response to text by combining all the parts of the response message
            const text = response.parts
                .filter(part => part.type === "text")
                .map(part => part.text)
                .join(" ")
                .trim()

            // If there is no contents to the response message
            if (!text) {
                return;
            }

            // Execute the on response called back for a successfully processed response message
            props.onResponse(text);
        }
    });

    // Automatically sync messages to localStorage whenever they update
    React.useEffect(() => {
        if (globalThis.window === undefined) {
            return;
        }
        globalThis.localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages, storageKey]);

    const send = React.useCallback(async (message: string) => {
        // Send the message with the code's attachment
        await sendMessage(
            {text: message},
            {
                body: {
                    mode: isBehaviourPage ? "behavioural" : "mixed",
                    difficulty: difficulty,
                    currentCode: isBehaviourPage ? null : code,
                    language: isBehaviourPage ? null : language,
                }
            }
        );
    }, [sendMessage, code, difficulty, language])

    const clear = React.useCallback(() => {
        // Clear the stored messages
        globalThis.localStorage.removeItem(storageKey);
    }, [])

    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<ILLMContext>(() => {
        return {
            messages: messages,
            send: send,
            status: status,
            clearMessages: clear,
            difficulty: difficulty,
            setDifficulty: setDifficulty,
        }
    }, [messages, send, status, clear, setDifficulty, difficulty]);

    return (
        <LLMContext.Provider value={value}>
            {props.children}
        </LLMContext.Provider>
    )
}