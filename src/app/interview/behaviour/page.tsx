"use client";

import React from "react";
import ChatSidebar from "@/components/chatbot/ChatSidebar";
import TimerDisplay from "@/components/timer/TimerDisplay";

export default function BehaviouralPage() {
    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className={"p-4 bg-sidebar-background border-b border-b-border"}>
                <TimerDisplay duration={35}/>
            </div>
            <div className={"flex-1 min-h-0"}>
                <ChatSidebar className="flex-1 min-h-0 w-full"/>
            </div>
        </div>
    );
}