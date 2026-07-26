"use client";

import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => setMessage(null), 3200);
  }, []);

  return { message, showToast };
}

export default function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4 transition-all duration-300 ease-studio md:justify-end md:pr-10 ${
        message ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      aria-live="polite"
    >
      {message && (
        <div className="flex items-center gap-3 border border-brass bg-ink px-5 py-3.5 text-sm text-paper shadow-lg">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
          {message}
        </div>
      )}
    </div>
  );
}
