import { Event } from '@/types/eventTypes';

export class EventCoverUtils {
  public static getEventCoverImageUrl(event: Pick<Event, 'coverImageUrl' | 'website'>): string | undefined {
    return event.coverImageUrl ?? event.website?.headerImageUrl;
  }
}

export const getEventCoverImageUrl = EventCoverUtils.getEventCoverImageUrl;
