'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { useWhisper } from '../hooks/useWhisper';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const { recordingState, error, toggleRecording } = useWhisper((text) => {
    setInput(prev => prev ? `${prev} ${text}` : text);
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const micLabel =
    recordingState === 'recording' ? 'Stop' :
    recordingState === 'transcribing' ? '...' : '🎙';

  const micColour =
    recordingState === 'recording'
      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
      : 'bg-gray-200 hover:bg-gray-300';

  const isChatDisabled = status !== 'ready' || recordingState !== 'idle';

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl py-8 px-4">

        <div className="space-y-4 mb-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'} text-black`}>
                <div className="text-xs text-gray-500 mb-1">
                  {m.role === 'user' ? 'You' : 'Advocate Agent'}
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {m.parts.map((part, i) => {
                    if (part.type === 'text') return <span key={i}>{part.text}</span>;
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 mb-2 text-center">{error}</p>
        )}
        {recordingState === 'transcribing' && (
          <p className="text-xs text-gray-400 mb-2 text-center">Transcribing with Whisper…</p>
        )}

        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            disabled={recordingState === 'transcribing' || status !== 'ready'}
            title={recordingState === 'recording' ? 'Stop recording' : 'Start voice input'}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${micColour} text-black`}
          >
            {micLabel}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              recordingState === 'recording' ? 'Recording… click Stop when done' :
              recordingState === 'transcribing' ? 'Transcribing…' :
              'Type your message...'
            }
            disabled={isChatDisabled}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-black outline-none focus:ring-2 focus:ring-[#f55036] disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isChatDisabled || !input.trim()}
            className="rounded-lg bg-[#f55036] px-4 py-2 text-white hover:bg-[#d94530] disabled:opacity-50"
          >
            {status === 'streaming' ? '...' : 'Send'}
          </button>
        </form>

      </div>
    </div>
  );
}