"use client"

import React from "react"
import {CodeContext, ICodeContext} from "@/components/contexts/code/CodeContext";
import {SupportedLanguages} from "@/lib/types/languages";
import {IInterviewContext, InterviewContext} from "@/components/contexts/interview/InterviewContext";

// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
}

// React context provider component used to expose the context to children
export function InterviewProvider(props: Readonly<Props>): React.ReactNode {
    const [sessionId, setSessionId] = React.useState<number | null>(null);

    const startInterview = React.useCallback(async (problemId?: string, problemTitle?: string, difficulty?: string) => {
        const res = await fetch("/api/interview/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ problemId, problemTitle, difficulty })
        });

        if (res.ok) {
            const data = await res.json();
            setSessionId(data.sessionId);
        }
    }, [setSessionId]);

    const completeInterview = React.useCallback(async (scores: any) => {
        if (!sessionId) return; // Cannot complete if never started!

        await fetch("/api/interview/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, ...scores })
        });

        setSessionId(null); // Reset after completion
    }, [sessionId, setSessionId]);

    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<IInterviewContext>(() => {
        return {
            sessionId: sessionId,
            startInterview: startInterview,
            completeInterview: completeInterview,
        }
    }, [sessionId, startInterview, completeInterview]);

    // Return the provider component
    return (
        <InterviewContext.Provider value={value}>
            {props.children}
        </InterviewContext.Provider>
    )
}