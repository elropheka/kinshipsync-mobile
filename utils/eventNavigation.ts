import { Href, router } from 'expo-router';

export type EventScopedScreen =
  | 'rsvps'
  | 'schedule'
  | 'seating'
  | 'tasks'
  | 'teams'
  | 'budget'
  | 'ideas'
  | 'themes'
  | 'website'
  | 'createNewTeam'
  | 'messages';

const PATH_BASED_SCREENS: ReadonlySet<EventScopedScreen> = new Set(['teams', 'tasks']);

export class EventNavigation {
  public static resolveEventId(
    value: string | string[] | undefined,
  ): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    const resolved = Array.isArray(value) ? value[0] : value;
    const trimmed = resolved?.trim();
    return trimmed ? trimmed : undefined;
  }

  public static buildHref(screen: EventScopedScreen, eventId: string): Href {
    if (PATH_BASED_SCREENS.has(screen)) {
      return `/(events)/${screen}/${encodeURIComponent(eventId)}` as Href;
    }
    return `/(events)/${screen}?eventId=${encodeURIComponent(eventId)}` as Href;
  }

  public static push(screen: EventScopedScreen, eventId: string): void {
    if (!eventId.trim()) {
      return;
    }
    router.push(EventNavigation.buildHref(screen, eventId));
  }
}
