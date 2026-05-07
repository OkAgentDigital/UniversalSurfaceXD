import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveOptions {
  save: () => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({ save, delay = 1000, enabled = true }: UseAutoSaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  const triggerSave = useCallback(() => {
    if (!enabled) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      try {
        await save();
      } finally {
        isSavingRef.current = false;
      }
    }, delay);
  }, [save, delay, enabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { triggerSave, isSaving: isSavingRef.current };
}
