import React from "react";
import Link from "next/link";
import {ThemeMenu} from "@/components/ThemeMenu";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader(props: Readonly<Props>): React.ReactNode {
    return (
        <header className={"h-16 w-full flex flex-row items-center justify-between px-32 py-4 border-b bg-background"}>
            <div className="flex flex-row items-center gap-4">
                <h1>MochA</h1>
                <ThemeMenu />
            </div>
            <nav className={"flex flex-row items-center gap-8"}>
                <ul className={"flex flex-row gap-4"}>
                    <li>
                        <Link href="/" className="hover:underline">Home</Link>
                    </li>
                    <li>
                        <Link href="/about" className="hover:underline">About</Link>
                    </li>
                </ul>
                <ul className={"flex flex-row gap-2"}>
                    <li>
                        <Link href="/login" className="hover:underline">Login</Link>
                    </li>
                    <p>or</p>
                    <li>
                        <Link href="/signup" className="hover:underline">Sign-Up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
