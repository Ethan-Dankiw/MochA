"use server"

import Groq from "groq-sdk";

const groq = new Groq();

export default async function transcribeAudio(data: FormData): Promise<ServerResponse<string>> {
    try {
        // Extract the audio file from the form data
        const audio = data.get('audio') as File;

        // If no audio file was found
        if (!audio) {
            return {success: false, error: "No audio file provided"};
        }

        // Transcribe the audio file into text
        const transcription = await groq.audio.transcriptions.create({
            file: audio,
            model: 'whisper-large-v3-turbo', // Fast + accurate. Alt: 'whisper-large-v3'
            response_format: 'json',
            language: 'en', // Remove this line to enable auto-detection
        });

        // Return the text of the transcription
        return {success: true, data: transcription.text};
    } catch (error) {
        console.error('Transcription error:', error);
        return {success: false, error: "Failed to transcribe audio file"};
    }
}