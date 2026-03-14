"use client";

import React from "react";
import ChatSidebar from "@/components/chatbot/ChatSidebar";

export default function BehaviouralPage() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <ChatSidebar
        className="flex-1 flex flex-col min-h-0" // full height, column layout
      />
    </div>
  );
}