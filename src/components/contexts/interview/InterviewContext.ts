"use client"

import React from "react"
import {SupportedLanguages} from "@/lib/types/languages";


// The context value used when using the context
export interface IInterviewContext {
    sessionId: number | null;
    startInterview: (problemId?: string, problemTitle?: string, difficulty?: string) => Promise<void>;
    completeInterview: (scores: any) => Promise<void>;
}


// Create the context
export const InterviewContext = React.createContext<IInterviewContext | null>(null);


// Use the context to deconstruct the context value in child components
export const useInterview = (): IInterviewContext => {
    // Use the context to get the context value
    const value: IInterviewContext | null = React.useContext(InterviewContext);

    // If the context value does not exist
    if (value === null) {
        throw new ReferenceError("useInterview must be used within a child component of the context provider");
    }

    // Return the context value for deconstruction
    return value;
}