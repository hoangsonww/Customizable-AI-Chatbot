import { FOOTER_MESSAGE } from "@/configuration/ui";
import Link from "next/link";

export default function ChatFooter() {
  return (
    <div className="w-full text-xs flex flex-wrap pt-2 text-gray-500">
      {/* Left Pane */}
      <div className="w-full sm:flex-1 text-center sm:text-left mb-1 sm:mb-0">
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
      </div>

      {/* Center Pane */}
      <div className="w-full sm:flex-1 text-center mb-1 sm:mb-0">
        {FOOTER_MESSAGE}
      </div>

      {/* Right Pane */}
      <div className="w-full sm:flex-1 text-center sm:text-right">
        {/* Do not remove or modify the following message. Removal or modification violates the license agreement. */}
        <a
          href="https://sonnguyenhoang.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Developed by Son Nguyen in 2025
        </a>
      </div>
    </div>
  );
}
