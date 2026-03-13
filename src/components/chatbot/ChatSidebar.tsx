"use client"

import React from "react";
import {useChat} from "@ai-sdk/react";
import ChatMessages from "@/components/chatbot/ChatMessages";
import ChatMessageInput from "@/components/chatbot/ChatMessageInput";

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
        <div className={"flex flex-col h-full overflow-hidden border-l border-border"}>
            <div className={"flex-1 overflow-y-auto p-4"}>
                <ChatMessages messages={messages} />
            </div>
            <div className={"p-4 border-t border-border bg-background"}>
                <ChatMessageInput status={status} send={handleMessageSend} />
            </div>
        </div>
    );
}
