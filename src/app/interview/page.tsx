"use client"

import React from "react";
import CodeEditor from "@/components/CodeEditor";
import {SidebarInset} from "@/components/ui/sidebar";
import ChatSidebar from "@/components/chatbot/ChatSidebar";
import Timer from "@/components/Timer";


type Props = {
    children?: React.ReactNode;
    className?: string;
}


export default function InterviewPage(props: Readonly<Props>): React.ReactNode {
    // LLM Hooks

    return (
        <div className={"flex flex-1 min-h-0 overflow-hidden"}>
            <SidebarInset className={"flex flex-col flex-1 min-h-0"}>
                <div className={"flex-1"}>
                    <CodeEditor initialCode={'console.log("Hello from Monaco!");'} />
                </div>
            </SidebarInset>

            <Timer/>

            <ChatSidebar />
        </div>
    );
}
