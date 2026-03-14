'use client';
import { useState, useRef, useCallback } from 'react';
import {RecordingState} from "@/components/contexts/vtt/VoiceToTextContext";

export function useWhisper(onTranscript: (text: string) => void) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    setRecordingState('transcribing');
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Transcription request failed');

      const { text, error } = await res.json();
      if (error) throw new Error(error);

      onTranscript(text);
    } catch (err) {
      setError('Could not transcribe audio. Please try again.');
      console.error(err);
    } finally {
      setRecordingState('idle');
    }
  }, [onTranscript]);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setRecordingState('recording');
    } catch {
      setError('Microphone access denied. Please allow microphone permissions.');
      setRecordingState('idle');
    }
  }, [transcribeAudio]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const toggleRecording = useCallback(() => {
    if (recordingState === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  }, [recordingState, startRecording, stopRecording]);

  return { recording: recordingState, error, toggleRecording: toggleRecording };
}