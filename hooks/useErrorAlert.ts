import { useEffect, useRef } from 'react';
import { useAlert } from '@/context/AlertContext';
import { getErrorMessage } from '@/utils/errorUtils';

interface UseErrorAlertOptions {
  title?: string;
  enabled?: boolean;
}

export class ErrorAlertHook {
  public static useErrorAlert(
    error: unknown,
    options: UseErrorAlertOptions = {},
  ): void {
    const { showError } = useAlert();
    const lastShownKey = useRef<string | null>(null);
    const { title = 'Error', enabled = true } = options;

    useEffect(() => {
      if (!enabled || !error) {
        lastShownKey.current = null;
        return;
      }

      const message = getErrorMessage(error);
      const dedupeKey = `${title}:${message}`;

      if (lastShownKey.current === dedupeKey) {
        return;
      }

      lastShownKey.current = dedupeKey;
      showError(title, message);
    }, [error, enabled, title, showError]);
  }
}

export const useErrorAlert = ErrorAlertHook.useErrorAlert.bind(ErrorAlertHook);
