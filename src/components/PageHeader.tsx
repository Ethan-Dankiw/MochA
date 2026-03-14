"use client"

import React from "react";
import {ThemeMenu} from "@/components/ThemeMenu";
import StyledLink from "@/components/StyledLink";
import {SessionPayload} from "@/lib/types/session";
import {getSessionPayload} from "@/lib/session/session";
import { signOut } from "next-auth/react";
import { destroySession } from "@/lib/session/session";
import {useSession} from "@/components/contexts/session/SessionContext";

const transition = "transition-all duration-300";
const underline = "underline underline-offset-12 hover:underline-offset-4";
const decoration = "decoration-2 decoration-transparent hover:decoration-[inherit]";
const baseStyles = `${transition} ${underline} ${decoration}`;

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader(props: Readonly<Props>): React.ReactNode {
    const {session, logout} = useSession();

    return (
        <header className={"h-16 w-full flex flex-row items-center justify-between px-32 py-4 border-b bg-background"}>
            <div className="flex flex-row items-center gap-4">
                <h1>MochA</h1>
            </div>
            <nav className={"flex flex-row items-center gap-8"}>
                <ul className={"flex flex-row gap-4"}>
                    <li>
                        <StyledLink href={"/"} className={'p-2'}>Home</StyledLink>
                    </li>
                    <li>
                        <StyledLink href={"/about"} className={'p-2'}>About</StyledLink>
                    </li>
                </ul>
                {/* Right Side: Conditional Auth Links */}
                {session?.authenticated ? (
                    <ul className="flex flex-row gap-2 items-center">
                        <StyledLink href={`/profile/${session.user_id}`} className="p-2">
                            Profile
                        </StyledLink>
                        <li className="text-xs font-mono lowercase">or</li>
                        <li>
                            <button
                                onClick={logout}
                                className={`${baseStyles} p-2 font-medium cursor-pointer bg-transparent border-none`}
                            >
                                Sign-Out
                            </button>
                        </li>
                    </ul>
                ) : (
                    <ul className="flex flex-row gap-2 items-center">
                        <li>
                            <StyledLink href="/auth/login" className="p-2">Login</StyledLink>
                        </li>
                        <li className="text-xs font-mono lowercase">or</li>
                        <li>
                            <StyledLink href="/auth/signup" className="p-2 font-medium">Sign-Up</StyledLink>
                        </li>
                    </ul>
                )}
                <ThemeMenu />
            </nav>
        </header>
    );
}
