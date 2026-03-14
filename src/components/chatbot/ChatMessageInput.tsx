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
    const {status: messageStatus, sendMessage} = useLLM();

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
        await sendMessage(trimmed);

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
                                'bg-neutral-600 hover:bg-neutral-500 text-neutral-300 hover:text-neutral-200'
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
                        className={`flex-1 rounded-lg border-2 border-neutral-600 px-2 py-2 text-block outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-no-drop`}/>
                </Field>
                <Field className={"flex w-min"}>
                    <Button type={"submit"} disabled={inInputDisabled}
                            className={`flex-1 rounded-md bg-blue-300 hover:bg-blue-400 active:bg-blue-500 px-4 py-2 disabled:opacity-50 disabled:cursor-no-drop`}>
                        <span>{messageStatus === 'streaming' ? '...' : 'Send'}</span>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
