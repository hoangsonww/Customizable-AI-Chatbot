import { LoadingIndicator, IndicatorIconType } from "@/types";
import { motion } from "framer-motion";
import { Brain, FileStack, FileSearch, Scan, AlertCircle } from "lucide-react";

/**
 * This file contains the Loading component which is used to display
 * loading indicators during the chat process. It uses the framer-motion
 * library for animations and lucide-react for icons.
 *
 * @file components/chat/loading.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * Loading indicator component that displays the status of the
 * loading process. It shows different icons based on the
 * loading state (thinking, searching, understanding,
 * documents, error).
 *
 * @param status - The status message to display
 * @param icon - The icon to display (thinking, searching, understanding,
 * @param isError - Whether the loading process is in error state
 * @param isDone - Whether the loading process is done
 */
export function Pill({
  status,
  icon,
  isError,
  isDone,
}: {
  status: string;
  icon: IndicatorIconType;
  isError: boolean;
  isDone: boolean;
}) {
  return (
    <div
      className={`flex flex-row items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm ${
        isError
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : isDone
            ? "border-transparent bg-muted/40 text-muted-foreground"
            : "border-border/60 bg-background/70 text-muted-foreground animate-pulse"
      }`}
    >
      {icon === "thinking" && <Brain className="w-4 h-4" />}
      {icon === "searching" && <FileSearch className="w-4 h-4" />}
      {icon === "understanding" && <Scan className="w-4 h-4" />}
      {icon === "documents" && <FileStack className="w-4 h-4" />}
      {icon === "error" && <AlertCircle className="w-4 h-4" />}
      <p>{status}</p>
    </div>
  );
}

/**
 * Loading component that displays the loading indicators
 * based on the current state of the application. It shows
 * different icons and status messages based on the loading
 * process (thinking, searching, understanding, documents,
 * error).
 *
 * @param indicatorState - The current state of the loading indicators
 */
export default function Loading({
  indicatorState,
}: {
  indicatorState: LoadingIndicator[];
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex max-w-[75%] flex-col gap-2 rounded-3xl border bg-card/80 px-4 py-3 shadow-sm backdrop-blur transition-shadow duration-300"
    >
      {indicatorState.map((indicator, index) => {
        return (
          <Pill
            key={indicator.status}
            status={indicator.status}
            icon={indicator.icon}
            isError={indicator.icon === "error"}
            isDone={index !== indicatorState.length - 1}
          />
        );
      })}
    </motion.div>
  );
}
