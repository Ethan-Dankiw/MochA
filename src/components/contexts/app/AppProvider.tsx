"use client"

import React from "react"
import {AppContext, IAppContext} from "@/components/contexts/app/AppContext";
import TextToSpeechProvider from "@/components/contexts/tts/TextToSpeechProvider";
import {useTextToSpeech} from "@/components/contexts/tts/TextToSpeechContext";
import {LLMProvider} from "@/components/contexts/llm/LLMProvider";
import {useLLM} from "@/components/contexts/llm/LLMContext";
import VoiceToTextProvider from "@/components/contexts/vtt/VoiceToTextProvider";
import {CodeProvider} from "@/components/contexts/code/CodeProvider";
import {SessionProvider} from "@/components/contexts/session/SessionProvider";


// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
}

function LLMBridge(props: Readonly<Props>) {
    // Get the function for reading text from the LLM using TTS
    const { playTTS } = useTextToSpeech();

    return (
        <LLMProvider onResponse={playTTS}>
            {props.children}
        </LLMProvider>
    )
}

function VoiceToTextBridge(props: Readonly<Props>) {
    // Get the function for sending a message to the LLM when voice is transcribed to text
    const { send } = useLLM();

    return (
        <VoiceToTextProvider onTranscriptionDone={send}>
            {props.children}
        </VoiceToTextProvider>
    )
}

// React context provider component used to expose the context to children
export default function AppProvider(props: Readonly<Props>): React.ReactNode {
    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<IAppContext>(() => {
        return {}
    }, []);

    // Return the provider component
    return (
        <AppContext.Provider value={value}>
            <SessionProvider>
                <CodeProvider>
                    <TextToSpeechProvider>
                        <LLMBridge>
                            <VoiceToTextBridge>
                                {props.children}
                            </VoiceToTextBridge>
                        </LLMBridge>
                    </TextToSpeechProvider>
                </CodeProvider>
            </SessionProvider>
        </AppContext.Provider>
    )
}