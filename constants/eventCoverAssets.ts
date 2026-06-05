import type { ImageSourcePropType } from 'react-native';

export class EventCoverAssets {
  public static readonly fallbackCover: ImageSourcePropType = require('@/assets/images/event-cover-fallback.png');
}

export const EVENT_COVER_FALLBACK = EventCoverAssets.fallbackCover;
