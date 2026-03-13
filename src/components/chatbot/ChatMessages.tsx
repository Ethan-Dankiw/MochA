import React from "react";
import {UIMessage} from "ai";

type Props = {
    messages: Array<UIMessage>
}

export default function ChatMessages(props: Readonly<Props>): React.ReactNode {
    return (
        <div className={"flex flex-col gap-4"}>
            {props.messages.length == 0 && <p>No Messages</p>}
            {props.messages.length > 0 && props.messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-neutral-400 text-gray-900' : 'bg-neutral-700 text-neutral-300'} text-black`}>
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
