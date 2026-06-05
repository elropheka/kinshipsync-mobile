import { Href, router } from 'expo-router';

export type EventScopedScreen =
  | 'rsvps'
  | 'schedule'
  | 'seating'
  | 'tasks'
  | 'budget'
  | 'ideas'
  | 'themes'
  | 'website'
  | 'createNewTeam'
  | 'messages';

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
    return `/(events)/${screen}?eventId=${encodeURIComponent(eventId)}` as Href;
  }

  public static push(screen: EventScopedScreen, eventId: string): void {
    if (!eventId.trim()) {
      return;
    }
    router.push(EventNavigation.buildHref(screen, eventId));
  }
}
