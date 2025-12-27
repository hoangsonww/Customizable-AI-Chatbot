import { chunkSchema } from "@/types";

/**
 * This file contains utility functions for processing and handling chat data.
 * It includes functions for handling message formatting,
 * generating response contexts, managing user inputs,
 * and processing chunked data for chat-based applications.
 *
 * @file utilities/chatProcessing.js
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * Formats a message to match the expected response structure
 * for a chat-based application.
 *
 * @param {string} role - The role of the sender (e.g., "user", "assistant")
 * @param {string} content - The content of the message
 * @returns {Object} - The formatted message object
 */
export function formatMessage(role, content) {
  return {
    role,
    content,
  };
}

/**
 * Processes an array of user input chunks and returns a processed context
 * that will be used for generating a response.
 *
 * @param {Array} chunks - Array of chunks to process
 * @param {number} citationNumber - The citation number to include in context
 * @returns {string} - Processed context from the chunks
 */
export function processUserInputForContext(chunks, citationNumber) {
  let context = "";
  chunks.forEach((chunk, index) => {
    context += chunk.text + ` [${citationNumber}]`;
    if (index < chunks.length - 1) {
      context += "\n";
    }
  });
  return context;
}

/**
 * Extracts all citations from a given message and formats them
 * to be displayed with their source information.
 *
 * @param {string} message - The message to extract citations from
 * @returns {Array} - Array of formatted citations
 */
export function extractCitationsFromMessage(message) {
  const citationRegex = /\[(\d+)\]/g;
  const citations = [];
  let match;
  while ((match = citationRegex.exec(message)) !== null) {
    citations.push({ citationNumber: match[1], source: `Source ${match[1]}` });
  }
  return citations;
}

/**
 * Generates a structured response based on user input and context,
 * combining the user message with the chatbot's response.
 *
 * @param {string} userMessage - The message from the user
 * @param {string} chatbotResponse - The response from the chatbot
 * @param {Array} citations - List of citations to include in the response
 * @returns {string} - The formatted structured response
 */
export function generateStructuredResponse(
  userMessage,
  chatbotResponse,
  citations,
) {
  let response = `User: ${userMessage}\n\n`;
  response += `Chatbot: ${chatbotResponse}\n\n`;
  if (citations.length > 0) {
    response += "Citations:\n";
    citations.forEach((citation) => {
      response += `[${citation.citationNumber}] ${citation.source}\n`;
    });
  }
  return response;
}

/**
 * Combines multiple chunks of text into a single response body
 * that can be sent as part of a message.
 *
 * @param {Array} chunks - Array of chunk objects to combine
 * @returns {string} - The combined text from all chunks
 */
export function combineChunksIntoResponse(chunks) {
  return chunks.map((chunk) => chunk.text).join(" ");
}

/**
 * Checks if a given message is from a user or the assistant
 *
 * @param {Object} message - The message object to check
 * @returns {boolean} - True if the message is from the user, false otherwise
 */
export function isUserMessage(message) {
  return message.role === "user";
}

/**
 * Validates the message format to ensure it follows the expected structure
 *
 * @param {Object} message - The message to validate
 * @returns {boolean} - True if the message is valid, false otherwise
 */
export function validateMessageFormat(message) {
  if (typeof message.role !== "string" || typeof message.content !== "string") {
    console.error("Invalid message format");
    return false;
  }
  return true;
}

/**
 * Sorts the given chunks of data by their order number
 *
 * @param {Array} chunks - Array of chunk objects to sort
 * @returns {Array} - The sorted chunks
 */
export function sortChunksByOrder(chunks) {
  return chunks.sort((a, b) => a.order - b.order);
}

/**
 * Prepares a list of chunks for chunk-based processing by cleaning
 * unnecessary characters and sorting them by order.
 *
 * @param {Array} chunks - Array of chunk objects to prepare
 * @returns {Array} - Array of cleaned and sorted chunks
 */
export function prepareChunksForProcessing(chunks) {
  const cleanedChunks = chunks.map((chunk) => ({
    ...chunk,
    text: chunk.text.trim().replace(/\s+/g, " "), // Remove extra spaces
  }));
  return sortChunksByOrder(cleanedChunks);
}

/**
 * Generates a response context by combining user input, citations, and system instructions.
 *
 * @param {string} userMessage - The user's message
 * @param {string} systemMessage - The system's message or instruction
 * @param {Array} citations - The list of citations to include
 * @returns {string} - The generated context string
 */
export function generateResponseContext(userMessage, systemMessage, citations) {
  let context = `System: ${systemMessage}\nUser: ${userMessage}\n\n`;
  if (citations.length > 0) {
    context += "Citations:\n";
    citations.forEach((citation) => {
      context += `[${citation.citationNumber}] ${citation.source}\n`;
    });
  }
  return context;
}
