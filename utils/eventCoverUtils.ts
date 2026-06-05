import type { ImageSourcePropType } from 'react-native';
import { EventCoverAssets } from '@/constants/eventCoverAssets';
import { Event, WebsitePayload } from '@/types/eventTypes';

export class EventCoverUtils {
  public static coerceHttpUrl(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      return undefined;
    }

    if (typeof URL !== 'undefined' && typeof URL.canParse === 'function' && !URL.canParse(trimmed)) {
      return undefined;
    }

    return trimmed;
  }

  public static normalizeEventCoverFields<
    T extends { coverImageUrl?: string; website?: WebsitePayload },
  >(event: T): T {
    const coverImageUrl = this.coerceHttpUrl(event.coverImageUrl);
    const website = this.normalizeWebsiteCover(event.website);

    return {
      ...event,
      coverImageUrl,
      website,
    };
  }

  public static getEventCoverImageUrl(event: Pick<Event, 'coverImageUrl' | 'website'>): string | undefined {
    return (
      this.coerceHttpUrl(event.coverImageUrl) ?? this.coerceHttpUrl(event.website?.headerImageUrl)
    );
  }

  public static getEventCoverImageSource(
    event: Pick<Event, 'coverImageUrl' | 'website'>,
  ): ImageSourcePropType {
    const url = this.getEventCoverImageUrl(event);
    return url ? { uri: url } : EventCoverAssets.fallbackCover;
  }

  public static getEventCoverImageSourceFromUrl(url?: string): ImageSourcePropType {
    const normalizedUrl = this.coerceHttpUrl(url);
    return normalizedUrl ? { uri: normalizedUrl } : EventCoverAssets.fallbackCover;
  }

  private static normalizeWebsiteCover(website: WebsitePayload | undefined): WebsitePayload | undefined {
    if (!website) {
      return undefined;
    }

    const headerImageUrl = this.coerceHttpUrl(website.headerImageUrl);

    return {
      ...website,
      ...(headerImageUrl ? { headerImageUrl } : { headerImageUrl: undefined }),
    };
  }
}

export const coerceHttpUrl = EventCoverUtils.coerceHttpUrl.bind(EventCoverUtils);
export const normalizeEventCoverFields = EventCoverUtils.normalizeEventCoverFields.bind(EventCoverUtils);
export const getEventCoverImageUrl = EventCoverUtils.getEventCoverImageUrl.bind(EventCoverUtils);
export const getEventCoverImageSource = EventCoverUtils.getEventCoverImageSource.bind(EventCoverUtils);
export const getEventCoverImageSourceFromUrl =
  EventCoverUtils.getEventCoverImageSourceFromUrl.bind(EventCoverUtils);
