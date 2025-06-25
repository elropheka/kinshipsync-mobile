import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, QueryDocumentSnapshot, Timestamp } from '@firebase/firestore';
import { firestore } from '../services/firebaseConfig';
import type { Event, WebsitePayload, UpdateEventWebsiteDetailsPayload } from '../types/eventTypes';

export const useEventWebsite = (slug: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [websiteDetails, setWebsiteDetails] = useState<WebsitePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventAndWebsite = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);
      try {
        // First, find the event by slug
        const eventsRef = collection(firestore, 'events');
        const eventsSnapshot = await getDocs(eventsRef);
        const eventDoc = eventsSnapshot.docs.find((docSnapshot: QueryDocumentSnapshot) => {
          const data = docSnapshot.data();
          return data.website?.customUrlSlug === slug;
        });

        if (!eventDoc) {
          setError('Event not found');
          return;
        }

        const eventData = eventDoc.data();
        setEvent({
          id: eventDoc.id,
          ...eventData,
          createdAt: eventData.createdAt instanceof Timestamp ? eventData.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: eventData.updatedAt instanceof Timestamp ? eventData.updatedAt.toDate().toISOString() : new Date().toISOString(),
        } as Event);

        // Then fetch website details
        const websiteDocRef = doc(collection(firestore, 'events', eventDoc.id, 'website'), 'details');
        const websiteDoc = await getDoc(websiteDocRef);

        if (websiteDoc.exists()) {
          const data = websiteDoc.data();
          setWebsiteDetails({
            title: data.title,
            customUrlSlug: data.customUrlSlug,
            headerImageUrl: data.headerImageUrl,
            welcomeMessage: data.welcomeMessage,
            sections: data.sections || [],
            websiteThemeId: data.websiteThemeId,
            published: data.published || false
          });
        } else {
          // Initialize with default values if no website exists
          setWebsiteDetails({
            published: false,
            sections: []
          });
        }
      } catch (err) {
        console.error('Error fetching event and website details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndWebsite();
  }, [slug]);

  const updateWebsiteDetails = async (updates: UpdateEventWebsiteDetailsPayload): Promise<void> => {
    if (!event?.id) return;

    try {
      const websiteDocRef = doc(collection(firestore, 'events', event.id, 'website'), 'details');
      
      // Update the website field in the event document as well
      const eventDocRef = doc(firestore, 'events', event.id);
      const eventWebsiteData = {
        customUrlSlug: updates.customUrlSlug,
        published: updates.published,
      };
      await updateDoc(eventDocRef, { website: eventWebsiteData });
      const updatedData = {
        ...updates,
        lastUpdatedAt: new Date().toISOString()
      };

      await setDoc(websiteDocRef, updatedData, { merge: true });

      // Update local state
      setWebsiteDetails(prev => prev ? {
        ...prev,
        ...updates
      } : null);

      return;
    } catch (err) {
      console.error('Error updating website details:', err);
      throw new Error('Failed to update website details');
    }
  };

  return {
    event,
    websiteDetails,
    loading,
    error,
    updateWebsiteDetails
  };
};
