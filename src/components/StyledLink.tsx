import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

type Props = {
    children?: React.ReactNode | string;
    className?: string;
    href: string;
}

const transition = "transition-all duration-300"
const underline = "underline underline-offset-12 hover:underline-offset-4"
const decoration = "decoration-2 decoration-transparent hover:decoration-[inherit]"
const same_link = "underline-offset-4! decoration-[inherit]!"

export default function StyledLink(props: Readonly<Props>): React.ReactNode {
    const pathname = usePathname();
    return (
        <Link href={props.href} className={`${transition} ${underline} ${decoration} ${props.href === pathname && same_link} ${props.className ?? ""}`}>{props.children}</Link>
    );
}
