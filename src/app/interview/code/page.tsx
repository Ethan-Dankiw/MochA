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

            <div className="flex flex-col border-l border-neutral-800">
                <div className="p-4 border-b border-neutral-800 sticky top-0 bg-neutral-950 z-10 bg-primary">
                    <Timer />
                </div>

                <div className="flex-1 min-h-0">
                    <ChatSidebar />
                </div>
            </div>
        </div>
    );
}
