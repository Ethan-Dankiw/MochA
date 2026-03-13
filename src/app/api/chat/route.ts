import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai'; // 1. Import this

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: 'You are a intterviewer for google',
    // 2. Await the conversion here
    messages: await convertToModelMessages(messages), 
  });

  // 3. Ensure you are using toUIMessageStreamResponse() 
  // to match the new useChat protocol
  return result.toUIMessageStreamResponse();
}