import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from '@firebase/firestore';
import { firestore } from '@/services/firebaseConfig';
import { Event } from '@/types/eventTypes';

export interface HomeFeaturedEvent {
  title: string;
  subtitle: string;
  imageUri?: string;
  eventId: string;
}

export interface HomeDashboardMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface HomeGalleryPhoto {
  id: string;
  uri: string;
  caption?: string;
}

const ATTENDING_STATUSES = new Set(['accepted', 'Attending']);

export class HomeDashboardDataLoader {
  public static deriveFeaturedEvent(events: Event[]): HomeFeaturedEvent | null {
    const upcoming = [...events]
      .filter((event) => event.status !== 'completed' && event.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const event = upcoming[0];
    if (!event) {
      return null;
    }

    return {
      title: event.name,
      subtitle: event.location ?? 'Location TBD',
      imageUri: event.website?.headerImageUrl,
      eventId: event.id,
    };
  }

  public static async loadAttendingMembers(eventIds: string[]): Promise<HomeDashboardMember[]> {
    const memberMap = new Map<string, HomeDashboardMember>();

    for (const eventId of eventIds.slice(0, 5)) {
      const guestsSnap = await getDocs(collection(firestore, 'events', eventId, 'guests'));
      guestsSnap.forEach((docSnap) => {
        const guest = docSnap.data() as {
          status?: string;
          name?: string;
          firstName?: string;
          lastName?: string;
        };
        const status = guest.status;
        if (!status || !ATTENDING_STATUSES.has(status)) {
          return;
        }

        const id = `${eventId}-${docSnap.id}`;
        if (!memberMap.has(id)) {
          const name =
            guest.name?.trim() ||
            `${guest.firstName ?? ''} ${guest.lastName ?? ''}`.trim() ||
            'Guest';
          memberMap.set(id, { id, name });
        }
      });
    }

    return Array.from(memberMap.values()).slice(0, 12);
  }

  public static async loadGalleryPhotos(eventIds: string[]): Promise<HomeGalleryPhoto[]> {
    const photos: HomeGalleryPhoto[] = [];

    for (const eventId of eventIds.slice(0, 5)) {
      const ideasSnap = await getDocs(
        query(
          collection(firestore, 'events', eventId, 'ideas'),
          orderBy('createdAt', 'desc'),
          limit(10),
        ),
      );

      ideasSnap.forEach((docSnap) => {
        const idea = docSnap.data() as { imageUrl?: string; title?: string };
        if (idea.imageUrl) {
          photos.push({
            id: `${eventId}-${docSnap.id}`,
            uri: idea.imageUrl,
            caption: idea.title,
          });
        }
      });
    }

    return photos.slice(0, 12);
  }
}

export function useHomeDashboard(events: Event[]) {
  const [members, setMembers] = useState<HomeDashboardMember[]>([]);
  const [photos, setPhotos] = useState<HomeGalleryPhoto[]>([]);
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);

  const featured = useMemo(
    () => HomeDashboardDataLoader.deriveFeaturedEvent(events),
    [events],
  );

  const eventIds = useMemo(() => events.map((event) => event.id), [events]);

  useEffect(() => {
    if (eventIds.length === 0) {
      setMembers([]);
      setPhotos([]);
      return;
    }

    let cancelled = false;

    const loadExtras = async () => {
      setIsLoadingExtras(true);
      try {
        const [loadedMembers, loadedPhotos] = await Promise.all([
          HomeDashboardDataLoader.loadAttendingMembers(eventIds),
          HomeDashboardDataLoader.loadGalleryPhotos(eventIds),
        ]);
        if (!cancelled) {
          setMembers(loadedMembers);
          setPhotos(loadedPhotos);
        }
      } catch (error) {
        console.error('Failed to load home dashboard extras:', error);
        if (!cancelled) {
          setMembers([]);
          setPhotos([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingExtras(false);
        }
      }
    };

    loadExtras();

    return () => {
      cancelled = true;
    };
  }, [eventIds]);

  return { featured, members, photos, isLoadingExtras };
}
