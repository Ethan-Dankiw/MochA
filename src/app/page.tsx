"use client"

import Link from "next/link"
import React from "react";
import {SessionPayload} from "@/lib/types/session";
import {getSessionPayload} from "@/lib/session/session";

export default function HomePage() {
    const [session, setSession] = React.useState<SessionPayload | null>(null);

    React.useEffect(() => {
        // Get the session
        getSessionPayload().then(session => setSession(session));
    }, [])


    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-primary px-6">
            <div className="max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-4">
                    AI Mock Technical Interviewer
                </h1>

                <p className="text-lg text-gray-600 mb-8" style={{color: "var(--text-color)"}}>
                    Practice technical interviews with an AI interviewer.
                    Get instant feedback and improve your problem solving skills.
                </p>

                <div className="flex gap-4 justify-center">
                    {!session?.authenticated ? (
                        <Link
                            href="/auth/login"
                            className="px-6 py-3 rounded-md! bg-button-primary! text-button-primary-foreground! hover:bg-button-primary-hover! hover:text-button-primary-foreground-hover!"
                        >
                            Login
                        </Link>
                    ):(
                        <Link
                            href="/interview/choose"
                            className="rounded-lg border-2 border-button-primary-foreground px-6 py-3 hover:bg-button-primary"
                        >
                            Start Interview
                        </Link>
                    )}
                </div>
            </div>
        </main>
    )
}