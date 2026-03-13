"use client"

import React from "react"
import {ITextToSpeechContext, TextToSpeechContext} from "@/components/contexts/tts/TextToSpeechContext";
import generateAudio from "@/actions/elevenlabs";
import {toast} from "sonner";

// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
}

// React context provider component used to expose the context to children
export default function TextToSpeechProvider(props: Readonly<Props>): React.ReactNode {
    // Define the state for when the TTS is currently speaking
    const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);

    const playTTS = React.useCallback(async (text: string) => {
        // Cancel any current speech (essential for responsiveness)
        globalThis.speechSynthesis.cancel();

        // Set the state for currently speaking
        setIsSpeaking(true);

        try {
            // Generate the audio for the text using ElevenLabs TTS
            const response = await generateAudio(text);

            // If the audio was not generated
            if (!response.success) {
                console.error(response.error);
                toast.error("Failed to generate TTS audio", { position: "top-center" });
                return;
            }

            // Get the audio data from the response
            const data = response.data.trim();

            // If there is no contents to the audio data
            if (!data) {
                toast.warning("Generated TTS audio has no contents", { position: "top-center" });
                return;
            }

            // Construct the URI for the audio element
            const uri = `data:audio/mp3;base64,${data}`;

            // Create the audio element based on the data URI
            const audio = new Audio(uri);

            // Speed it up slightly
            audio.playbackRate = 1.1;

            // Update the speaking state when speaking ends or error
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = () => setIsSpeaking(false);

            // Play the audio
            await audio.play()
        } catch (e) {
            console.error("TTS Playback Failed: ", e);
        }
    }, [setIsSpeaking])

    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<ITextToSpeechContext>(() => {
        return {
            playTTS: playTTS,
            isSpeaking: isSpeaking,
        }
    }, [playTTS, isSpeaking]);

    // Return the provider component
    return (
        <TextToSpeechContext.Provider value={value}>
            {props.children}
        </TextToSpeechContext.Provider>
    )
}