"use client"

import React from "react";
import {Sidebar, SidebarContent, SidebarFooter} from "@/components/ui/sidebar";
import ChatMessageInput from "@/components/chatbot/ChatMessageInput";
import ChatMessages from "@/components/chatbot/ChatMessages";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function ChatSidebar(props: Readonly<Props>): React.ReactNode {
    return (
        <Sidebar side={"right"} collapsible={"none"} className={"border-l bg-background h-full"}>
            <SidebarContent className={"flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar"}>
                <ChatMessages />
            </SidebarContent>
            <SidebarFooter className={"shrink-0 p-4 border-t border-border"}>
                <ChatMessageInput />
            </SidebarFooter>
        </Sidebar>
    )
}
