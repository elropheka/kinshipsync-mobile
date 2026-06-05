import { useCallback } from 'react';
import { useFocusEffect, useGlobalSearchParams, usePathname } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { EventNavigation } from '@/utils/eventNavigation';

function extractEventIdFromRoute(
  pathname: string,
  params: { eventId?: string | string[]; id?: string | string[] },
): string | undefined {
  const fromQuery = EventNavigation.resolveEventId(params.eventId);
  if (fromQuery) {
    return fromQuery;
  }

  const fromId = EventNavigation.resolveEventId(params.id);
  if (fromId) {
    return fromId;
  }

  const match = pathname.match(/\/(details|teams|tasks|guests)\/([^/?]+)/);
  return match?.[2];
}

export function useEventThemeScope(): void {
  const { loadThemeForEvent } = useTheme();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ eventId?: string | string[]; id?: string | string[] }>();

  useFocusEffect(
    useCallback(() => {
      const resolvedEventId = extractEventIdFromRoute(pathname, params);
      loadThemeForEvent(resolvedEventId ?? null);

      return () => {
        loadThemeForEvent(null);
      };
    }, [pathname, params.eventId, params.id, loadThemeForEvent]),
  );
}
