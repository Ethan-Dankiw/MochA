import React from "react";
import {Button} from "@/components/ui/button";
import {Play, RotateCcw, Square} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

type Props = {
    className?: string,
    isRunning: boolean;
    isLocked: boolean;
    onReload: () => void;
    onStart: () => void;
    onStop: () => void;
}

export default function TimerToggle(props: Readonly<Props>): React.ReactNode {
    // If the timer is locked, display a refresh button
    if (props.isLocked) {
        return (
            <Button variant={"default"}
                    onClick={props.onReload}
                    className={`bg-neutral-400 hover:bg-neutral-500 active:bg-neutral-600 text-neutral-800 ${props.className ?? ""}`}>
                <RotateCcw size={"icon"}/>
            </Button>
        )
    }

    // If the timer is not running, display a start button
    if (!props.isRunning) {
        return (
            <Popover>
                <PopoverTrigger asChild disabled={props.isLocked}>
                    <Button variant={"default"} disabled={props.isLocked}
                            className={`${props.isLocked && "cursor-no-drop!"} bg-green-400 hover:bg-green-500 active:bg-green-600 text-green-800 ${props.className ?? ""}`}>
                        <Play size={"icon"}/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={'rounded-md w-48'}>
                    <p>You will not be able to pause the interview once started!</p>
                    <Button variant={"default"}
                            className={"cursor-pointer bg-button-primary hover:bg-button-primary-hover"}
                            onClick={props.onStart}>
                        <span>Start the Interview</span>
                    </Button>
                </PopoverContent>
            </Popover>
        )
    }

    // If the timer is running, display a stop button
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"default"} disabled={props.isLocked}
                        className={`bg-red-400 hover:bg-red-500 active:bg-red-600 text-red-800 ${props.className ?? ""}`}>
                    <Square size={"icon"}/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={'rounded-md w-48'}>
                <p>Stopping the timer will end the interview and you wont be able to restart!</p>
                <Button variant={"default"} className={"cursor-pointer bg-button-primary hover:bg-button-primary-hover"}
                        onClick={props.onStop}>
                    <span>Stop the Interview</span>
                </Button>
            </PopoverContent>
        </Popover>
    )
}
