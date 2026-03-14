import {groq} from '@ai-sdk/groq';
import {convertToModelMessages, streamText} from 'ai';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const maxDuration = 20;

// Define separate caches at the top of the file
let cached_base_prompt: string | null = null;
let cached_timeout_prompt: string | null = null; // New variable

const getBasePrompt = async (): Promise<string | null> => {
    if (cached_base_prompt) return cached_base_prompt;
    try {
        const file_path = path.join(process.cwd(), 'src', 'lib', 'data', 'prompt.txt');
        cached_base_prompt = await fs.readFile(file_path, 'utf8');
        return cached_base_prompt;
    } catch (e) { return null; }
}

const getTimeoutPrompt = async (): Promise<string | null> => {
    // FIX: Check its OWN cache variable
    if (cached_timeout_prompt) return cached_timeout_prompt;
    try {
        const file_path = path.join(process.cwd(), 'src', 'lib', 'data', 'timeout.txt');
        cached_timeout_prompt = await fs.readFile(file_path, 'utf8');
        return cached_timeout_prompt;
    } catch (e) { return null; }
}

export async function POST(req: Request) {
    const { messages, currentCode, isTimeout } = await req.json();

    // 1. Determine which system prompt to use
    let systemInstruction: string;

    if (isTimeout) {
        console.log("Timeout flag detected. Loading summary prompt...");
        const timeoutPrompt = await getTimeoutPrompt();
        systemInstruction = timeoutPrompt ?? "Interview over. Summarize performance.";
    } else {
        const basePrompt = await getBasePrompt();
        systemInstruction = currentCode 
            ? `${basePrompt}\n\n=== LIVE CODE ===\n${currentCode}`
            : basePrompt ?? "";
    }

    // 2. Execute with the CHOSEN system prompt
    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: systemInstruction, // The logic is now entirely here
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}

