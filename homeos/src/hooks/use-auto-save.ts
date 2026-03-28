"use client";

import { useRef, useState, useEffect } from "react";

export function useAutoSave(
  id: string,
  title: string,
  content: string,
  saveFn: (id: string, data: { title: string; content: string }) => Promise<void>
) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      await saveFn(id, { title, content });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, title, content, saveFn]);

  return status;
}
