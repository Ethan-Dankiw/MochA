import React from "react";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function PageHeader(props: Readonly<Props>): React.ReactNode {
    return (
        <header className={"h-16 w-full flex flex-row items-center justify-between px-32 py-4"}>
            <h1>Technical Interview</h1>
            <nav className={"flex flex-row items-center gap-8"}>
                <ul className={"flex flex-row gap-4"}>
                    <li>Home</li>
                    <li>About</li>
                </ul>
                <ul className={"flex flex-row gap-2"}>
                    <li>Login</li>
                    <p>or</p>
                    <li>Sign-Up</li>
                </ul>
            </nav>
        </header>
    );
}
