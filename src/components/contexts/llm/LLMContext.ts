"use client"

import React from "react"
import {ChatStatus, UIMessage} from "ai";
import {QuestionDifficulty} from "@/lib/types/difficulty";

// The context value used when using the context
export interface ILLMContext {
    messages: Array<UIMessage>,
    send: (message: string) => Promise<void>,
    clearMessages: () => void,
    status: ChatStatus,
    difficulty: QuestionDifficulty,
    setDifficulty: (difficulty: QuestionDifficulty) => void,
}


// Create the context
export const LLMContext = React.createContext<ILLMContext | null>(null);


// Use the context to deconstruct the context value in child components
export const useLLM = (): ILLMContext => {
    // Use the context to get the context value
    const value: ILLMContext | null = React.useContext(LLMContext);

    // If the context value does not exist
    if (value === null) {
        throw new ReferenceError("useLLM must be used within a child component of the context provider");
    }

    // Return the context value for deconstruction
    return value;
}