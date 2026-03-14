"use client"

import React from "react"


// The context value used when using the context
export interface ITextToSpeechContext {
    playTTS: (text: string) => Promise<void>;
    isSpeaking: boolean;
}


// Create the context
export const TextToSpeechContext = React.createContext<ITextToSpeechContext | null>(null);


// Use the context to deconstruct the context value in child components
export const useTextToSpeech = (): ITextToSpeechContext => {
    // Use the context to get the context value
    const value: ITextToSpeechContext | null = React.useContext(TextToSpeechContext);

    // If the context value does not exist
    if (value === null) {
        throw new ReferenceError("useTextToSpeech must be used within a child component of the context provider");
    }

    // Return the context value for deconstruction
    return value;
}