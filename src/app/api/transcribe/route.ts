import Groq from 'groq-sdk';

const groq = new Groq();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3-turbo', // Fast + accurate. Alt: 'whisper-large-v3'
      response_format: 'json',
      language: 'en', // Remove this line to enable auto-detection
    });

    return Response.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return Response.json({ error: 'Transcription failed' }, { status: 500 });
  }
}