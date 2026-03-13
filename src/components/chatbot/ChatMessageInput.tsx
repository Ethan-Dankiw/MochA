"use client"

import React from "react";
import {Field, FieldGroup} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChatStatus} from "ai";

type Props = {
    status: ChatStatus;
    send: (message: string) => Promise<void>;
}

export default function ChatMessageInput(props: Readonly<Props>): React.ReactNode {
    // Define the chat message being typed out by
    const [message, setMessage] = React.useState<string | null>(null);

    return (
        <form action={() => props.send(message ?? "")}>
            <FieldGroup className={"flex flex-row"}>
                <Field className={"w-full"}>
                    <Input type={"text"} disabled={props.status !== 'ready'} placeholder={"Type your message..."}
                           value={message ?? ""} onChange={(e) => setMessage(e.target.value)}
                           className={"flex-1 rounded-lg border border-neutral-900 px-4 py-2 text-block outline-none focus:ring-2 focus:ring-red-400"}/>
                </Field>
                <Field className={"w-min"}>
                    <Button type={"submit"} disabled={props.status != "ready"}
                            className={"rounded-lg bg-[#f55036] px-4 py-2 text-white hover:bg-[#d94530] disabled:opacity-50"}>
                        <span>{props.status === 'streaming' ? '...' : 'Send'}</span>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
