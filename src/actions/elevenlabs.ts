"use server"

import {ElevenLabsClient} from "@elevenlabs/elevenlabs-js";
import {BodyTextToSpeechFull} from "@elevenlabs/elevenlabs-js/api";

// Define the eleven labs client
let elevenlabs: ElevenLabsClient | null = null;

try {
    elevenlabs = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });
} catch (error) {
    console.error("Error creating ElevenLabsClient", error);
}

export default async function generateAudio(text: string, voice: string = "JBFqnCBsd6RMkjVDRZzb"): Promise<ServerResponse<string>> {
    // If eleven labs does not exist
    if (!elevenlabs) {
        return { success: false, error: 'Failed to connect to ElevenLabs' };
    }

    try {
        // Create the body of the TTS conversion
        const body: BodyTextToSpeechFull = {
            text: text,
            modelId: "eleven_turbo_v2_5",
            outputFormat: "mp3_44100_128",
        }

        // Convert the text to an audio stream using eleven labs
        const stream = await elevenlabs.textToSpeech.convert(
            voice,
            body,
        );

        // Get the reader for the stream
        const reader = stream.getReader();

        // Consume the stream on the server to create an array of chunks
        const chunks: Array<Uint8Array> = []
        while (true) {
            // Get a value from the stream reader
            const {done, value: data} = await reader.read();

            // If the stream is done
            if (done) {
                break;
            }

            // If there is no data from the stream to process
            if (data === undefined || data.length === 0) {
                continue;
            }

            // Add the data to the list of chunks
            chunks.push(data);
        }

        // Create a single buffer for the chunks
        const buffer = Buffer.concat(chunks);

        // Encode the string into a Base64 string
        return { success: true, data: buffer.toString("base64") };
    } catch (error) {
        console.error("ElevenLabs TTS Error:", error);
        return { success: false, error: 'Failed to generate audio using ElevenLabs' };
    }
}