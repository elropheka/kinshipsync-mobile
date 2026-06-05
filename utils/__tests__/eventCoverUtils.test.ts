import { Event } from '@/types/eventTypes';
import { EventCoverUtils } from '../eventCoverUtils';

describe('EventCoverUtils', () => {
  describe('coerceHttpUrl', () => {
    it('returns undefined for missing or invalid values', () => {
      expect(EventCoverUtils.coerceHttpUrl(undefined)).toBeUndefined();
      expect(EventCoverUtils.coerceHttpUrl(null)).toBeUndefined();
      expect(EventCoverUtils.coerceHttpUrl('')).toBeUndefined();
      expect(EventCoverUtils.coerceHttpUrl('   ')).toBeUndefined();
      expect(EventCoverUtils.coerceHttpUrl(123)).toBeUndefined();
      expect(EventCoverUtils.coerceHttpUrl({ url: 'https://example.com' })).toBeUndefined();
      expect(EventCoverUtils.coerceHttpUrl('not-a-url')).toBeUndefined();
    });

    it('returns trimmed https URLs', () => {
      expect(EventCoverUtils.coerceHttpUrl('  https://example.com/cover.jpg  ')).toBe(
        'https://example.com/cover.jpg',
      );
      expect(EventCoverUtils.coerceHttpUrl('http://example.com/cover.jpg')).toBe(
        'http://example.com/cover.jpg',
      );
    });
  });

  describe('getEventCoverImageUrl', () => {
    it('prefers coverImageUrl over website headerImageUrl', () => {
      const url = EventCoverUtils.getEventCoverImageUrl({
        coverImageUrl: 'https://example.com/cover.jpg',
        website: { headerImageUrl: 'https://example.com/header.jpg' },
      });

      expect(url).toBe('https://example.com/cover.jpg');
    });

    it('falls back to website headerImageUrl', () => {
      const url = EventCoverUtils.getEventCoverImageUrl({
        website: { headerImageUrl: 'https://example.com/header.jpg' },
      });

      expect(url).toBe('https://example.com/header.jpg');
    });

    it('returns undefined when legacy values are malformed', () => {
      const url = EventCoverUtils.getEventCoverImageUrl({
        coverImageUrl: '   ' as unknown as string,
        website: { headerImageUrl: 42 as unknown as string },
      });

      expect(url).toBeUndefined();
    });
  });

  describe('normalizeEventCoverFields', () => {
    it('strips invalid cover fields from legacy event docs', () => {
      const normalized = EventCoverUtils.normalizeEventCoverFields({
        id: 'event-1',
        name: 'Party',
        date: '2026-01-01',
        organizerId: 'org-1',
        visibility: 'public',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        coverImageUrl: 'ftp://bad.example/cover.jpg',
        website: {
          customUrlSlug: 'party',
          headerImageUrl: 'https://example.com/header.jpg',
        },
      } as Event);

      expect(normalized.coverImageUrl).toBeUndefined();
      expect(normalized.website?.headerImageUrl).toBe('https://example.com/header.jpg');
    });
  });
});
