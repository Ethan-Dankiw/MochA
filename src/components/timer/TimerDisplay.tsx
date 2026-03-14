"use client"

import React from 'react';
import TimerToggle from "@/components/timer/TimerToggle";
import TimerDuration from "@/components/timer/TimerDuration";
import {toast} from "sonner";
import {useLLM} from "@/components/contexts/llm/LLMContext";
import {refresh} from "next/cache";
import {useRouter} from "next/navigation";

type Props = {
    duration: number;
    className?: string;
}

export default function TimerDisplay(props: Readonly<Props>): React.ReactNode {
    const {send, clearMessages} = useLLM();

    // Define a lock for the timer so it's not started again
    const [lock, setLock] = React.useState<boolean>(false);

    // Define the running state of the timer
    const [running, setRunning] = React.useState<boolean>(false);

    // Define how long is left on the timer
    const [duration, setDuration] = React.useState<number>(props.duration * 60);

    // Store the interval
    const interval = React.useRef<NodeJS.Timeout | null>(null);

    globalThis.onbeforeunload = () => {
        clearMessages();
    }

    const startTimer = () => {
        // If the timer is locked
        if (lock) {
            toast.error("Cannot restart timer as interview has already ended")
            return;
        }

        // If an interval is already running
        if (interval.current) {
            toast.warning("Timer is already running")
            return;
        }

        // Create the interval
        interval.current = setInterval(() => {
            setDuration((prev) => {
                // Decrement the remaining time by 1 second
                const remaining = prev - 1;

                // If there is no remaining time
                if (remaining <= 0) {
                    expireTimer()
                    return 0;
                }

                // Return the remaining time left on the timer
                return remaining;
            });
        }, 1000)

        // Indicate the timer has started
        setRunning(true);

        // Send a start message
        send("I would like to start the technical interview now!").then(() => {})
    }

    const stopTimer  = () => {
        // Cancel the timer
        cancelTimer()

        // Send a start message
        send("I would like to finish the the interview now! Please grade what I done!").then(() => {
            // Clear stored messages for when the user refreshes their page
            clearMessages()
        })
    }

    const expireTimer = () => {
        // Cancel the timer
        cancelTimer()

        // Send a start message
        send("I would like to finish the the interview now! Please grade what I done even though I have not quite yet finished!").then(() => {
            // Clear stored messages for when the user refreshes their page
            clearMessages()
        })
    }

    const cancelTimer = () => {
        // If no timer exist
        if (!interval.current) {
            console.warn("There is no timer to cancel")
            return;
        }

        // Lock the timer
        setLock(true);

        // Cancel the interval
        clearInterval(interval.current)

        // Indicate the timer has stopped
        setRunning(false);

        // Remove the interval
        interval.current = null;
    }

    const reloadPage = () => {
        // Clear chat messages
        clearMessages();

        // Reload the page
        globalThis.location.reload();
    }

    return (
        <div className={'bg-primary p-2 rounded-lg flex flex-row items-center gap-2 w-full'}>
            <TimerToggle className={"rounded-md w-fit h-fit p-2 cursor-pointer"} isRunning={running} isLocked={lock} onReload={reloadPage} onStart={startTimer} onStop={stopTimer} />
            <TimerDuration remainingSeconds={duration} />
        </div>
    )
}