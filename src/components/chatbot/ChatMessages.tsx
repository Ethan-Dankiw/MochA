"use client"

import React from "react";
import {useLLM} from "@/components/contexts/llm/LLMContext";

type Props = {}

export default function ChatMessages(props: Readonly<Props>): React.ReactNode {
    const {messages} = useLLM();

    // 1. Pre-filter the messages using Memo for performance
    const visibleMessages = React.useMemo(() => {
        return messages.filter(m => 
            !m.parts.some(p => p.type === 'text' && p.text === "__INTERRUPT_SYSTEM_TIME_UP__")
        );
    }, [messages]);

    return (
        <div className={"flex flex-col flex-1 overflow-y-auto p-4"}>
            {/* 2. Check visibleMessages length, not raw messages */}
            {visibleMessages.length === 0 && (
                <div className="flex flex-1 items-center justify-center w-full">
                    <p className="text-center text-neutral-500">No Messages Yet</p>
                </div>
            )}
            
            {/* 3. Map over the filtered list directly */}
            {visibleMessages.map(message => (
                <div key={message.id} className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-foreground text-primary' : 'bg-primary text-foreground'}`}>
                        <div className={"text-sm mb-2 font-bold"}>
                            <p>{message.role === 'user' ? 'You' : 'Advocate Agent'}</p>
                        </div>
                        <div className={"text-sm whitespace-pre-wrap"}>
                            {message.parts.map((part, i) => {
                                if (part.type === 'text') {
                                    return <span key={i}>{part.text}</span>;
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}