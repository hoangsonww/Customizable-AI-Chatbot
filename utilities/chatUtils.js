import { QUESTION_RESPONSE_TOP_K } from "@/configuration/pinecone";
import { chunkSchema } from "@/types";
import OpenAI from "openai";

/**
 * This file contains utility functions for chat operations.
 * It includes functions to filter, manipulate, and process chunks and messages,
 * generate dynamic system messages, clean and combine text chunks,
 * and validate chunk and citation formats.
 *
 * @file utilities/chatUtils.js
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * Retrieves a set of recent messages from a conversation and returns them in reverse order
 *
 * @param {Array} messages - Array of messages to reverse
 * @returns {Array} - Array of messages in reverse order
 */
export function getRecentMessagesInReverseOrder(messages) {
  return messages.slice().reverse();
}

/**
 * Filters messages based on a specific keyword or phrase
 *
 * @param {Array} messages - Array of messages to filter
 * @param {string} keyword - Keyword or phrase to filter messages by
 * @returns {Array} - Filtered array of messages containing the keyword
 */
export function filterMessagesByKeyword(messages, keyword) {
  return messages.filter((message) => message.content.includes(keyword));
}

/**
 * Computes the number of tokens in a given message using OpenAI's tokenization
 *
 * @param {string} message - Message to compute the token count for
 * @param {Object} openai - OpenAI object containing the API key
 * @returns {Promise<number>} - Number of tokens in the message
 */
export async function computeTokenCount(message, openai) {
  try {
    const tokens = await openai.tokenize(message);
    return tokens.length;
  } catch (error) {
    console.error("Error computing token count:", error);
    throw new Error("Failed to compute token count");
  }
}

/**
 * Cleans a chunk of text by removing unwanted characters like punctuation or extra spaces
 *
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
export function cleanTextChunk(text) {
  return text.replace(/[^\w\s]/g, "").trim();
}

/**
 * Creates a prompt template using the provided messages and system instructions
 *
 * @param {Array} messages - Array of messages to include in the prompt
 * @param {string} systemInstructions - System instructions for the prompt
 * @returns {string} - Final formatted prompt string
 */
export function createPromptTemplate(messages, systemInstructions) {
  const messageContent = messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
  return `${systemInstructions}\n\n${messageContent}`;
}

/**
 * Filters chunks based on a minimum word count threshold
 *
 * @param {Array} chunks - Array of chunks to filter
 * @param {number} minWordCount - Minimum word count threshold
 * @returns {Array} - Filtered chunks that meet the word count requirement
 */
export function filterChunksByWordCount(chunks, minWordCount) {
  return chunks.filter((chunk) => chunk.text.split(" ").length >= minWordCount);
}

/**
 * Combines multiple chunks of text into a single paragraph for context
 *
 * @param {Array} chunks - Array of chunks to combine
 * @returns {string} - Combined text from all chunks
 */
export function combineChunksIntoContext(chunks) {
  return chunks.map((chunk) => chunk.text).join("\n");
}

/**
 * Extracts the source URLs from an array of chunks
 *
 * @param {Array} chunks - Array of chunks to extract source URLs from
 * @returns {Array} - Array of unique source URLs
 */
export function extractSourceUrlsFromChunks(chunks) {
  const sourceUrls = chunks.map((chunk) => chunk.source_url);
  return [...new Set(sourceUrls)]; // Return unique URLs
}

/**
 * Checks if a chunk has a valid citation format
 *
 * @param {string} text - Text of the chunk to check
 * @returns {boolean} - True if valid citation format is found, otherwise false
 */
export function hasValidCitationFormat(text) {
  const citationRegex = /\[\d+\]/;
  return citationRegex.test(text);
}

/**
 * Sorts chunks based on their order number and filters out any invalid chunks
 *
 * @param {Array} chunks - Array of chunks to sort and validate
 * @returns {Array} - Sorted array of valid chunks
 */
export function sortAndValidateChunks(chunks) {
  return chunks
    .filter((chunk) => chunk.text && chunk.order)
    .sort((a, b) => a.order - b.order);
}

/**
 * Generates a dynamic system message for a conversation
 *
 * @param {string} context - The context or state of the conversation
 * @returns {string} - A dynamically generated system message
 */
export function generateDynamicSystemMessage(context) {
  return `System Message: Current conversation state is "${context}". Please proceed accordingly.`;
}
