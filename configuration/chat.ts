import { OWNER_NAME, AI_NAME } from "./identity";

/**
 * This file allows users to configure the chat functionality of the AI.
 * It includes settings for the initial message, default response message,
 * word cutoff limit, word break message, and history context length.
 *
 * @file configuration/chat.ts
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

export const INITIAL_MESSAGE: string = `Hello, I'm ${AI_NAME}, ${OWNER_NAME}'s AI assistant. I'm here to help you with any questions or tasks you have. How can I assist you today?`;
export const DEFAULT_RESPONSE_MESSAGE: string = `Sorry, I'm having trouble generating a response. Please try again later.`;
export const WORD_CUTOFF: number = 12000; // Number of words until bot says it needs a break
export const WORD_BREAK_MESSAGE: string = `[WORD BREAK MESSAGE]`;
export const HISTORY_CONTEXT_LENGTH: number = 8; // Number of messages to use for context when generating a response
