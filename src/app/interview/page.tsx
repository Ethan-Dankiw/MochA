import React from "react";
import CodeEditor from "@/components/CodeEditor";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function InterviewPage(props: Readonly<Props>): React.ReactNode {
    return (
        <div className={"h-full"}>
            <CodeEditor initialCode={'console.log("Hello from Monaco!");'} />
        </div>
    );
}
