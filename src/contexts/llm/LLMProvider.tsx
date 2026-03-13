"use client"

import React from "react"
import {ILLMContext, LLMContext} from "@/contexts/llm/LLMContext";
import {useChat} from "@ai-sdk/react";

// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
    onResponse: (response: string) => void;
}

// React context provider component used to expose the context to children
export function LLMProvider(props: Readonly<Props>): React.ReactNode {
    const {messages, sendMessage, status} = useChat({
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

    const send = React.useCallback(async (message: string) => {
        await sendMessage({ text: message });
    }, [sendMessage])

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