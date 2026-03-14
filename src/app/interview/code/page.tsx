"use client"

import React from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import {SidebarInset} from "@/components/ui/sidebar";
import ChatSidebar from "@/components/chatbot/ChatSidebar";
import TimerDisplay from "@/components/timer/TimerDisplay";
import DifficultySelect from "@/components/DifficultySelect";
import LanguageSelector from "@/components/LanguageSelector";


type Props = {
    children?: React.ReactNode;
    className?: string;
}


export default function InterviewPage(props: Readonly<Props>): React.ReactNode {
    return (
        <div className={"flex flex-1 min-h-0 overflow-hidden"}>

            <SidebarInset className={"flex flex-col flex-1 min-h-0"}>
                <div className={"flex-1"}>
                    <CodeEditor initialCode={'console.log("Hello from Monaco!");'} />
                </div>
            </SidebarInset>

            <div className="flex flex-col border-l border-l-border">
                <div className="flex flex-row gap-2 p-2 border-b border-b-border bg-sidebar-background">
                    <div className={'w-1/3 h-full'}>
                        <LanguageSelector />
                    </div>
                    <div className={'w-1/3 h-full'}>
                        <DifficultySelect />
                    </div>
                    <div className={'w-1/3 h-full'}>
                        <TimerDisplay duration={20} />
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    <ChatSidebar />
                </div>
            </div>
        </div>
    );
}
