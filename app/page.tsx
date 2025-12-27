"use client";

import ChatInput from "@/components/chat/input";
import ChatMessages from "@/components/chat/messages";
import useApp from "@/hooks/use-app";
import ChatHeader from "@/components/chat/header";

/**
 * This file contains the main chat component that renders the chat
 * interface. It includes the chat header, messages, and input
 * components. It also handles the state and functionality of the chat
 * application.
 *
 * @file app/page.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * Chat component that renders the chat interface
 */
export default function Chat() {
  const {
    messages,
    handleInputChange,
    handleSubmit,
    input,
    isLoading,
    indicatorState,
    clearMessages,
  } = useApp();

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute left-[-120px] top-1/3 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
      </div>
      <ChatHeader clearMessages={clearMessages} />
      <div className="relative flex min-h-screen justify-center">
        <div className="flex h-full w-full max-w-4xl flex-col px-2 sm:px-4">
          <ChatMessages messages={messages} indicatorState={indicatorState} />
        </div>
      </div>
      <ChatInput
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        input={input}
        isLoading={isLoading}
      />
    </div>
  );
}
