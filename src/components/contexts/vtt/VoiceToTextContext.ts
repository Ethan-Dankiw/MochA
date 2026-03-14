"use client"

import React from "react"

// Define the state of the recording
export type RecordingState = "idle" | "recording" | "transcribing";

// The context value used when using the context
export interface IVoiceToText {
    toggleRecording: () => void;
    recordingState: "idle" | "recording" | "transcribing";
}


// Create the context
export const VoiceToTextContext = React.createContext<IVoiceToText | null>(null);


// Use the context to deconstruct the context value in child components
export const useVoiceToText = (): IVoiceToText => {
    // Use the context to get the context value
    const value: IVoiceToText | null = React.useContext(VoiceToTextContext);

    // If the context value does not exist
    if (value === null) {
        throw new ReferenceError("useVoiceToText must be used within a child component of the context provider");
    }

    // Return the context value for deconstruction
    return value;
}