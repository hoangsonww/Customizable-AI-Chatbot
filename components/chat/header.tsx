"use client";

import { Button } from "@/components/ui/button";
import { EraserIcon } from "lucide-react";
import Image from "next/image";
import { CHAT_HEADER, CLEAR_BUTTON_TEXT } from "@/configuration/ui";
import { AI_NAME } from "@/configuration/identity";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * This file contains the ChatHeader component which is used to display
 * the header of the chat interface. It includes the AI logo, chat title,
 * theme toggle button, and clear conversation button.
 *
 * @file components/chat/header.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * AILogo - A component that displays the AI logo with a green dot
 * indicating the AI is ALWAYS online.
 */
export const AILogo = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-sm"
  >
    <Image
      src="/ai-logo.png"
      alt={AI_NAME}
      width={48}
      height={48}
      className="h-full w-full object-cover"
    />
    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
  </motion.div>
);

/**
 * ChatHeader - A component that displays the header of the chat
 * interface. It includes the AI logo, chat title, theme toggle button,
 * and clear conversation button.
 *
 * @param {function} clearMessages - Function to clear the chat messages.
 */
export default function ChatHeader({
  clearMessages,
}: {
  clearMessages: () => void;
}) {
  return (
    <div className="z-10 fixed top-0 w-full border-b border-border/60 bg-background/80 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-2 sm:flex-row sm:justify-between">
        {/* logo & title: center on mobile, left on desktop */}
        <div className="flex items-center gap-3">
          <AILogo />
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold leading-tight">{CHAT_HEADER}</p>
            <p className="text-xs text-muted-foreground">
              Always ready to help with ideas and answers.
            </p>
          </div>
        </div>

        {/* controls: theme toggle + clear */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              onClick={clearMessages}
              className="gap-2"
              variant="outline"
              size="sm"
            >
              <EraserIcon className="w-4 h-4" />
              <span>{CLEAR_BUTTON_TEXT}</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
