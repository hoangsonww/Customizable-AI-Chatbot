"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import ChatFooter from "@/components/chat/footer";

/**
 * This file contains the ChatInput component which is used to render the
 * input field for the chat interface. It includes a text input for
 * the user to type their message and a submit button to send the
 * message.
 *
 * @file components/chat/input.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * ChatInputProps - Props for the ChatInput component
 */
interface ChatInputProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  isLoading: boolean;
}

/**
 * ChatInput - A component that displays the input field for the chat
 * interface. It includes a text input for the user to type their message
 * and a submit button to send the message.
 *
 * @param {function} handleInputChange - Function to handle input change.
 * @param {function} handleSubmit - Function to handle form submission.
 * @param {string} input - The current value of the input field.
 * @param {boolean} isLoading - Indicates if the chat is loading.
 */
export default function ChatInput({
  handleInputChange,
  handleSubmit,
  input,
  isLoading,
}: ChatInputProps) {
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  return (
    <>
      <div className="z-10 fixed bottom-0 left-0 right-0 flex flex-col items-center bg-gradient-to-t from-background via-background/90 to-transparent pb-5 pt-3 text-base">
        <div className="w-full max-w-4xl px-4 sm:px-6">
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-2 rounded-2xl border bg-background/80 p-2 shadow-lg backdrop-blur transition focus-within:ring-2 focus-within:ring-ring/60"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleInputChange}
                        value={input}
                        className="border-none bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Ask a question, paste text, or request a plan..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-10 w-10 rounded-xl p-0 text-primary-foreground shadow transition hover:shadow-md"
                disabled={input.trim() === "" || isLoading}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-full max-w-4xl px-4 sm:px-6">
          <ChatFooter />
        </div>
      </div>
    </>
  );
}
