import React from "react";

type Props = {
    className?: string;
    remainingSeconds: number;
}

export default function TimerDuration(props: Readonly<Props>): React.ReactNode {
    const [time, setTime] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Separate the minutes and seconds from the timer
        const minutes = Math.floor(props.remainingSeconds / 60);
        const seconds = props.remainingSeconds % 60;

        // Format the remaining time left
        const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        // Store the formatted time
        setTime(formatted);
    }, [props.remainingSeconds])

    return (
        <p className={`${props.className ?? ""} text-center min-w-18 w-full mr-1 font-bold text-xl`}>{time}</p>
    );
}
