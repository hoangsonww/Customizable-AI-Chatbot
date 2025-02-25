import { z } from "zod";
import { displayMessageSchema, loadingIndicatorSchema } from "@/types/chat";

export const streamedPayloadTypeSchema = z.enum([
  "message",
  "loading",
  "done",
  "error",
]);
export type StreamedPayloadType = z.infer<typeof streamedPayloadTypeSchema>;

export const streamedMessageSchema = z.object({
  message: displayMessageSchema,
  type: z.literal("message"),
});
export type StreamedMessage = z.infer<typeof streamedMessageSchema>;

export const streamedDoneSchema = z.object({
  type: z.literal("done"),
  final_message: z.string(),
});
export type StreamedDone = z.infer<typeof streamedDoneSchema>;

export const streamedLoadingSchema = z.object({
  type: z.literal("loading"),
  indicator: loadingIndicatorSchema,
});
export type StreamedLoading = z.infer<typeof streamedLoadingSchema>;

export const streamedErrorSchema = z.object({
  type: z.literal("error"),
  indicator: loadingIndicatorSchema,
});
export type StreamedError = z.infer<typeof streamedErrorSchema>;

export const streamedPayloadSchema = z.union([
  streamedMessageSchema,
  streamedLoadingSchema,
  streamedErrorSchema,
]);
export type StreamedPayload = z.infer<typeof streamedPayloadSchema>;
