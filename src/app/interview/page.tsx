import React from "react";
import CodeEditor from "@/components/CodeEditor";
import ChatSidebar from "@/components/chatbot/ChatSidebar";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function InterviewPage(props: Readonly<Props>): React.ReactNode {
    return (
        <div className={"h-full flex flex-row"}>
            <div className={"h-full w-7/10"}>
                <CodeEditor initialCode={'console.log("Hello from Monaco!");'} />
            </div>
            <div className={"flex-1 w-3/10"}>
                <ChatSidebar />
            </div>
        </div>
    );
}
