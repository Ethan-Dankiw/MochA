"use client"

import React from "react"
import { ITextToSpeechContext, TextToSpeechContext } from "@/components/contexts/tts/TextToSpeechContext";
import generateAudio from "@/actions/elevenlabs";
import { toast } from "sonner";

type Props = { children: React.ReactNode; }

export default function TextToSpeechProvider(props: Readonly<Props>): React.ReactNode {
    const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);
    
    // 1. Create a ref to track the current audio object
    const currentAudioRef = React.useRef<HTMLAudioElement | null>(null);

    const playTTS = React.useCallback(async (text: string) => {
        // 2. Stop any ElevenLabs audio that is currently playing
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.src = ""; // Clear source to free memory
        }

        // Keep this for native speech fallback if you ever use it
        globalThis.speechSynthesis.cancel();
        setIsSpeaking(true);

        try {
            const response = await generateAudio(text);

            if (!response.success) {
                console.error(response.error);
                setIsSpeaking(false);
                return;
            }

            const data = response.data.trim();
            if (!data) {
                setIsSpeaking(false);
                return;
            }

            const uri = `data:audio/mp3;base64,${data}`;
            const audio = new Audio(uri);
            
            // 3. Store the new audio in the ref
            currentAudioRef.current = audio;
            
            audio.playbackRate = 1.1;

            audio.onended = () => {
                setIsSpeaking(false);
                currentAudioRef.current = null;
            };
            audio.onerror = () => {
                setIsSpeaking(false);
                currentAudioRef.current = null;
            };

            await audio.play().catch(err => {
                console.warn("Playback blocked:", err);
                setIsSpeaking(false);
            });
        } catch (e) {
            console.error("TTS Playback Failed: ", e);
            setIsSpeaking(false);
        }
    }, [currentAudioRef.current, setIsSpeaking]);

    const value = React.useMemo<ITextToSpeechContext>(() => ({
        playTTS,
        isSpeaking,
    }), [playTTS, isSpeaking]);

    return (
        <TextToSpeechContext.Provider value={value}>
            {props.children}
        </TextToSpeechContext.Provider>
    )
}