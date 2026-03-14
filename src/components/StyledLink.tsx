import React from "react";
import Link from "next/link";

type Props = {
    children?: React.ReactNode | string;
    className?: string;
    href: string;
}

const transition = "transition-all duration-300"
const underline = "underline underline-offset-12 hover:underline-offset-4"
const decoration = "decoration-2 decoration-transparent hover:decoration-[inherit]"

export default function StyledLink(props: Readonly<Props>): React.ReactNode {
    return (
        <Link href={props.href} className={`${transition} ${underline} ${decoration} ${props.className ?? ""}`}>{props.children}</Link>
    );
}
