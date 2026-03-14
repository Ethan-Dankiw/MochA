import React from "react";
import Link from "next/link";
import {ThemeMenu} from "@/components/ThemeMenu";
import StyledLink from "@/components/StyledLink";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader(props: Readonly<Props>): React.ReactNode {
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
                <ul className={"flex flex-row gap-2"}>
                    <li>
                        <StyledLink href={"/login"} className={'p-2'}>Login</StyledLink>
                    </li>
                    <p>or</p>
                    <li>
                        <StyledLink href={"/signup"} className={'p-2'}>Sign-Up</StyledLink>
                    </li>
                </ul>
                <ThemeMenu />
            </nav>
        </header>
    );
}
