"use client"

import React from "react"
import {ILLMContext, LLMContext} from "@/components/contexts/llm/LLMContext";
import {useChat} from "@ai-sdk/react";
import {useCode} from "@/components/contexts/code/CodeContext";
import {usePathname, useSearchParams} from "next/navigation";
import {UIMessage} from "ai";

// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
    onResponse: (response: string) => void;
}

const readMessagesFromStorage = (storageKey: string): UIMessage[] => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// React context provider component used to expose the context to children
export function LLMProvider(props: Readonly<Props>): React.ReactNode {
    // Get the current state of the code editor's contents
    const {code} = useCode()
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isBehaviourPage = pathname === "/behaviour";
    const selectedDifficulty = searchParams.get("difficulty") ?? "medium";
    const storageKey = isBehaviourPage ? "chat_messages_behavioural_page" : "chat_messages_interview_page";
    const initialMessages = React.useMemo(() => readMessagesFromStorage(storageKey), [storageKey]);

    const {messages, sendMessage, status} = useChat({
        id: storageKey,
        initialMessages: initialMessages,
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

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages, storageKey]);

    const send = React.useCallback(async (message: string) => {
        // Send the message with the code's attachment
        await sendMessage(
            { text: message },
            { body: {
                mode: isBehaviourPage ? "behavioural" : "mixed",
                difficulty: selectedDifficulty,
                currentCode: isBehaviourPage ? null : code,
            }}
        );
    }, [sendMessage, code, isBehaviourPage, selectedDifficulty])

    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<ILLMContext>(() => {
        return {
            messages: messages,
            sendMessage: send,
            status: status
        }
    }, [messages, send, status]);

    // Return the provider component
    return (
        <LLMContext.Provider value={value}>
            {props.children}
        </LLMContext.Provider>
    )
}
