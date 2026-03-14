"use client"

import React from "react";
import {Field, FieldGroup} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useLLM} from "@/components/contexts/llm/LLMContext";
import {useVoiceToText} from "@/components/contexts/vtt/VoiceToTextContext";
import {Mic, Square} from "lucide-react";

type Props = {}

export default function ChatMessageInput(props: Readonly<Props>): React.ReactNode {
    // Define the chat message being typed out by
    const [message, setMessage] = React.useState<string | null>(null);

    // Get the status and send function from the LLM context
    const {status: messageStatus, send} = useLLM();

    // Get the recording information from the Voice to Text context
    const {recordingState, toggleRecording} = useVoiceToText();

    // Handle the submission of messages
    const handleMessageSend = async () => {
        // Trim the message to remove whitespace
        const trimmed = message?.trim();

        // If the message has no contents or a message has been sent
        if (!trimmed || messageStatus === "submitted") {
            return;
        }

        // Send the message
        await send(trimmed);

        // Reset the message
        setMessage(null);
    }

    // Define helper states for the state of the microphone button
    const isRecording = recordingState === "recording";
    const isTranscribing = recordingState === "transcribing";

    // Define helper states for if input has been disabled
    const inInputDisabled = messageStatus !== "ready" || isTranscribing;

    return (
        <form action={handleMessageSend}>
            <FieldGroup className={"flex flex-row gap-2"}>
                <Field className="flex w-min">
                    <Button
                        type={"button"} onClick={toggleRecording} disabled={inInputDisabled}
                        className={`flex-1 rounded-md transition-colors disabled:cursor-no-drop ${
                            isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white' :
                                'rounded-md! bg-button-primary! text-button-primary-foreground! hover:bg-button-primary-hover! hover:text-button-primary-foreground-hover!'
                        }`}
                        title={isRecording ? 'Stop recording' : 'Start voice input'}
                    >
                        {isRecording ? <Square/> : <Mic/>}
                    </Button>
                </Field>
                <Field className={"w-full"}>
                    <Input
                        type={"text"} disabled={inInputDisabled}
                        placeholder={
                            isRecording ? "Recording..." :
                                isTranscribing ? "Transcribing..." :
                                    "Type your message..."
                        }
                        value={message ?? ""} onChange={(e) => setMessage(e.target.value)}
                        className={`bg-primary! placeholder:text-primary-foreground text-primary-foreground flex-1 rounded-lg border-none px-2 py-2 outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-no-drop`}/>
                </Field>
                <Field className={"flex w-min"}>
                    <Button type={"submit"} disabled={inInputDisabled}
                            className={`flex-1 rounded-md bg-button-primary! text-button-primary-foreground! hover:bg-button-primary-hover! hover:text-button-primary-foreground-hover! px-4 py-2 disabled:opacity-50 disabled:cursor-no-drop`}>
                        <span>{messageStatus === 'streaming' ? '...' : 'Send'}</span>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
