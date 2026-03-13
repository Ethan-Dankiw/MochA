import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextRequest } from "next/server";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');

  if (!text) return new Response("Missing text", { status: 400 });

  // Use the .convert() method but return the stream directly
  const audioStream = await elevenlabs.textToSpeech.convert(
    "JBFqnCBsd6RMkjVDRZzb", // Your Voice ID
    {
      text: text,
      modelId: "eleven_turbo_v2_5", // CRITICAL for speed
      outputFormat: "mp3_44100_128",
    }
  );

  return new Response(audioStream as any, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    },
  });
}