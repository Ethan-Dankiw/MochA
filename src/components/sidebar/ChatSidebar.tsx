"use client"

import React from "react";
import {useChat} from "@ai-sdk/react";
import ChatMessages from "@/components/sidebar/chatbot/ChatMessages";
import ChatMessageInput from "@/components/sidebar/chatbot/ChatMessageInput";
import {Sidebar, SidebarContent, SidebarFooter} from "@/components/ui/sidebar";

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function ChatSidebar(props: Readonly<Props>): React.ReactNode {
    // Get the list of sent messages, the function to send a chat message to the AI and the message send status
    const {messages, sendMessage, status} = useChat();

    const handleMessageSend = async (text: string): Promise<void> => {
        await sendMessage({text: text});
    }

    return (
        <Sidebar side={"right"} collapsible={"none"} className={"border-l bg-background h-full"}>
            <SidebarContent className={"flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar"}>
                <ChatMessages messages={messages} />
            </SidebarContent>
            <SidebarFooter className={"shrink-0 p-4 border-t border-border"}>
                <ChatMessageInput status={status} send={handleMessageSend} />
            </SidebarFooter>
        </Sidebar>
    )
}
