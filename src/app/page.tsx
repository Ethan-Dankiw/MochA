"use client"

import Link from "next/link"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import React from "react";
import StyledLink from "@/components/StyledLink";
import {useSession} from "@/components/contexts/session/SessionContext";

export default function HomePage() {
    const {session} = useSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-primary px-6">
            <div className="max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-4">
                    AI Mock Interviewer
                </h1>

                <p className="text-lg text-gray-600 mb-8" style={{color: "var(--text-color)"}}>
                    Practice behavioural and technical interviews with an AI interviewer.
                    Get instant feedback and improve your problem solving skills.
                </p>

                <div className="flex gap-4 justify-center">
                    {session?.authenticated ? (
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
                                <StyledLink href="/interview/behaviour" className={"text-md text-center"}>Behavioural
                                    Interview</StyledLink>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="flex items-center px-6 py-3 rounded-md! bg-button-primary! text-button-primary-foreground! hover:bg-button-primary-hover! hover:text-button-primary-foreground-hover!"
                        >
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </main>
    )
}