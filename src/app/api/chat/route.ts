import {groq} from '@ai-sdk/groq';
import {convertToModelMessages, streamText} from 'ai';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const maxDuration = 20;

// Define the base prompt that is sent to initialise the AI with instructions on how to act
let cached_base_prompt: string | null = null;

/**
 * Get the contents of the AI's prompt from disk
 */
const getBasePrompt = async (): Promise<string | null> => {
    // If the prompt has already been cached
    if (cached_base_prompt) {
        return cached_base_prompt;
    }

    // Otherwise, fetch it from disk
    try {
        // Get the file path to the prompt file
        const prompt_file_path = path.join(process.cwd(), 'src', 'lib', 'data', 'prompt.txt');

        // Attempt to read the contents of the prompt text file
        cached_base_prompt = await fs.readFile(prompt_file_path, 'utf8');

        // Return the prompt
        return cached_base_prompt;
    } catch (error) {
        console.error("Failed to read prompt.txt:", error);
        return null;
    }
}

export async function POST(req: Request) {
    // Fetch the message and current code from the request
    const {messages, currentCode} = await req.json();

    // Get the base prompt for the AI
    const base_prompt = await getBasePrompt();

    // If the base prompt does not exist
    if (!base_prompt) {
        console.warn("No base prompt for the AI")
        return new Response("Internal Server Error: No base prompt found", { status: 500 });
    }

    // Dynamically append the contents of the user's code editor in the prompt
    const prompt = currentCode
        ? `${base_prompt}\n\n=== LIVE EDITOR STATE ===\nThe candidate is currently writing the following code in their editor. Use this to understand their context and answer their queries:\n${base_prompt}\n`
        : base_prompt

    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: prompt,
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}


