"use client";

import React from "react";
import { ILLMContext, LLMContext } from "@/components/contexts/llm/LLMContext";
import { useChat } from "@ai-sdk/react";
import { useCode } from "@/components/contexts/code/CodeContext";
import { usePathname, useSearchParams } from "next/navigation";
import { UIMessage } from "ai";

type Props = {
  children: React.ReactNode;
  onResponse: (response: string) => void;
};

const DEFAULT_TIME = 1200;
const TIMEOUT_SIGNAL = "__INTERRUPT_SYSTEM_TIME_UP__";

const readMessagesFromStorage = (storageKey: string): UIMessage[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function LLMProvider(props: Readonly<Props>): React.ReactNode {
  const { code } = useCode();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isBehaviourPage = pathname === "/behaviour";
  const selectedDifficulty = searchParams.get("difficulty") ?? "medium";
  const storageKey = isBehaviourPage
    ? "chat_messages_behavioural_page"
    : "chat_messages_interview_page";

  const initialMessages = React.useMemo(
    () => readMessagesFromStorage(storageKey),
    [storageKey]
  );

  const [secondsLeft, setSecondsLeft] = React.useState(DEFAULT_TIME);
  const [isTimerActive, setIsTimerActive] = React.useState(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: storageKey,
    initialMessages,
    onFinish: ({ message: response }) => {
      const text = response.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(" ")
        .trim();

      if (!text) return;
      props.onResponse(text);
    },
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isTimerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerActive && secondsLeft === 0) {
      setIsTimerActive(false);

      void sendMessage(
        { text: TIMEOUT_SIGNAL },
        {
          body: {
            mode: isBehaviourPage ? "behavioural" : "mixed",
            difficulty: selectedDifficulty,
            currentCode: isBehaviourPage ? null : code,
            isTimeout: true,
          },
        }
      );
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isTimerActive,
    secondsLeft,
    sendMessage,
    isBehaviourPage,
    selectedDifficulty,
    code,
  ]);

  const send = React.useCallback(
    async (message: string) => {
      await sendMessage(
        { text: message },
        {
          body: {
            mode: isBehaviourPage ? "behavioural" : "mixed",
            difficulty: selectedDifficulty,
            currentCode: isBehaviourPage ? null : code,
          },
        }
      );
    },
    [sendMessage, isBehaviourPage, selectedDifficulty, code]
  );

  const startTimer = React.useCallback(() => {
    setMessages([]);
    setSecondsLeft(DEFAULT_TIME);
    setIsTimerActive(true);
  }, [setMessages]);

  const pauseTimer = React.useCallback(() => {
    setIsTimerActive(false);
  }, []);

  const resetInterview = React.useCallback(() => {
    setMessages([]);
    setSecondsLeft(DEFAULT_TIME);
    setIsTimerActive(false);
  }, [setMessages]);

  const value = React.useMemo<ILLMContext>(
    () => ({
      messages,
      sendMessage: send,
      status,
      secondsLeft,
      isTimerActive,
      startTimer,
      pauseTimer,
      resetInterview,
    }),
    [
      messages,
      send,
      status,
      secondsLeft,
      isTimerActive,
      startTimer,
      pauseTimer,
      resetInterview,
    ]
  );

  return <LLMContext.Provider value={value}>{props.children}</LLMContext.Provider>;
}
