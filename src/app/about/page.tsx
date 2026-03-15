"use client"

import React from "react";
import {useSession} from "@/components/contexts/session/SessionContext";
import Link from "next/link";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import StyledLink from "@/components/StyledLink";

export default function AboutPage() {
    const {session} = useSession();

    return (
        <div className="min-h-screen flex flex-col bg-primary">
            {/* Header */}

            {/* Page Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="max-w-3xl text-center">
                    <h1
                        className="text-4xl font-bold mb-6"
                        style={{color: "var(--text-color)"}}
                    >
                        About AI Mock Interviewer
                    </h1>

                    <p
                        className="text-lg mb-6"
                        style={{color: "var(--text-color)"}}
                    >
                        This platform allows you to practice behavioural and technical interviews with an AI-powered interviewer.
                        Receive instant feedback on your answers, improve your problem-solving skills, and
                        prepare for real technical interviews in a low-pressure environment.
                    </p>

                    <p
                        className="text-lg mb-6"
                        style={{color: "var(--text-color)"}}
                    >
                        Built using Next.js, Tailwind CSS, and a custom Monaco code editor theme, our goal is
                        to provide a clean, interactive, and accessible experience for anyone looking to
                        improve their coding interview performance.
                    </p>

                    <div className="flex gap-4 justify-center">
                        {session?.authenticated && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"default"}
                                            className={"h-[inherit]! cursor-pointer rounded-lg border-2 border-button-primary-foreground px-6 py-3 hover:bg-button-primary"}>
                                        <span className={"text-lg"}>Start Interview</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className={'rounded-md w-48'}>
                                    <StyledLink href="/interview/code" className={"text-md text-center"}>Technical
                                        Interview</StyledLink>
                                    <StyledLink href="/interview/behaviour" className={"text-md text-center"}>Behavioural Interview</StyledLink>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}