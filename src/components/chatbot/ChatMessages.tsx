import React from "react";
import {useLLM} from "@/components/contexts/llm/LLMContext";

type Props = {}

export default function ChatMessages(props: Readonly<Props>): React.ReactNode {
    // Get all the messages from the LLM
    const {messages} = useLLM();

    return (
        <div className={"flex flex-col gap-4"}>
            {messages.length == 0 && <p>No Messages</p>}
            {messages.length > 0 && messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} text-black`}>
                        <div className={"text-sm mb-2 font-bold"}>
                            <p>{message.role === 'user' ? 'You' : 'Advocate Agent'}</p>
                        </div>
                        <div className={"text-sm whitespace-pre-wrap"}>
                            {message.parts.map((part, i) => {
                                if (part.type === 'text') {
                                    return <span key={part.text}>{part.text}</span>;
                                }
                                // You can handle other types like 'tool-invocation' here later
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
