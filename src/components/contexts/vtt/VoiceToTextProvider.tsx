"use client"

import React from "react"
import {IVoiceToText, RecordingState, VoiceToTextContext} from "@/components/contexts/vtt/VoiceToTextContext";
import transcribeAudio from "@/actions/transcribe";
import {toast} from "sonner";

// The type used to provide interface values to the context provider component
type Props = {
    children: React.ReactNode;
    onTranscriptionDone: (transcription: string) => void;
}

// React context provider component used to expose the context to children
export default function VoiceToTextProvider(props: Readonly<Props>): React.ReactNode {
    // Define the state of the recording
    const [state, setState] = React.useState<RecordingState>("idle")

    // Define the media recorder (microphone)
    const recorder = React.useRef<MediaRecorder | null>(null);

    // Define the audio chunks that were recorded
    const chunks = React.useRef<Array<Blob>>([])

    const processAudio = React.useCallback(async (chunk: Blob) => {
        // Set the state for transcribing an audio chunk
        setState("transcribing")

        try {
            // Prepare the audio file into a form
            const data = new FormData();
            data.append("audio", chunk, "recording.webm");

            // Transcribe the audio
            const response = await transcribeAudio(data);

            // If there was an error with the transcription
            if (!response.success) {
                console.error(response.error);
                toast.error("Failed to transcribe voice recording", { position: "top-center"});
                return;
            }

            // Extract the transcription from the response
            const transcription = response.data.trim();

            // If the transcription has no contents
            if (!transcription) {
                toast.warning("Transcribed voice recording has no contents", { position: "top-center"});
                return;
            }

            // Execute the callback when a successful transcription is done
            props.onTranscriptionDone(transcription);
        } catch (error) {
            console.error("Transcription Error:", error);
            toast.error("Error occurred while transcribing voice recording", { position: "top-center"});
        } finally {
            // Return to the idle recording state when done
            setState("idle")
        }
    }, [setState, props])

    const startRecording = React.useCallback(async () => {

        try {
            // Request microphone access from the user
            const stream = await navigator.mediaDevices.getUserMedia({audio: true})

            // Create a recorder that reads from the microphone audio stream
            const microphone = new MediaRecorder(stream);
            recorder.current = microphone;

            // Reset the recorded audio chunks
            chunks.current = [];

            // When audio has been recorded from the user
            microphone.ondataavailable = (event) => {
                // Get the data from the recorded audio
                const audio = event.data;

                // If there is no data in the recorded audio
                if (audio.size === 0) {
                    return;
                }

                // Add the recorded audio to the list of recorded audio chunks
                chunks.current.push(audio);
            }

            // When the user stops recorded audio
            microphone.onstop = () => {
                // Compile all recorded audio chunks into a blob and transcribe them to text
                const blob = new Blob(chunks.current, {type: "audio/webm"});
                processAudio(blob);

                // Clean-up microphone tracks so recording dot disappears
                stream.getTracks().forEach(track => track.stop())
                setState("idle")
            }

            // Start recording audio from the microphone
            microphone.start();
            setState("recording")
        } catch (error) {
            console.error("Microphone access denied or failed:", error);
            toast.error("Could not access microphone. Check your browser permissions.", { position: "top-center"});
            setState("idle")
        }
    }, [recorder.current, chunks.current, processAudio, setState])

    const stopRecording = React.useCallback(() => {
        // If an audio recorder for the microphone does not exist, or is not idle
        if (!recorder.current || recorder.current.state === "inactive") {
            return;
        }

        // Stop the microphone recorder (triggers 'onstop' event)
        recorder.current.stop();
    }, [recorder.current])

    const toggleRecording = React.useCallback(() => {
        // If currently recording audio from the microphone
        console.log("0. Toggle clicked! Current state:", state);
        if (state === "recording") {
            stopRecording()
        } else {
            // Otherwise, start a new recording
            startRecording().then(() => {
            });
        }
    }, [state, stopRecording, startRecording])

    // Memoize the context value to its no re-computed on renders unnecessarily
    const value = React.useMemo<IVoiceToText>(() => {
        return {
            toggleRecording: toggleRecording,
            recordingState: state,
        }
    }, [toggleRecording, state]);

    // Return the provider component
    return (
        <VoiceToTextContext.Provider value={value}>
            {props.children}
        </VoiceToTextContext.Provider>
    )
}