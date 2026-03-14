"use client"

import React from "react";
import {Button} from "@/components/ui/button";
import {Play} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {fireConfetti} from "@/lib/utils/confetti";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function StartPlaceholder(props: Readonly<Props>): React.ReactNode {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    const handleConfetti = () => {
        if (buttonRef.current) {
            fireConfetti(buttonRef.current);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button ref={buttonRef} variant={"default"} onClick={handleConfetti}
                        className={`w-fit p-2 rounded-md bg-green-400 hover:bg-green-500 active:bg-green-600 text-green-800`}>
                    <Play size={"icon"}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={'rounded-md w-48'}>
                Hooray! This does nothing! Click the real start button to chat &lt;3
            </PopoverContent>
        </Popover>
    );
}
