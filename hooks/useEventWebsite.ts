import { useState, useEffect } from 'react';
import * as eventService from '../services/eventService';
import type { Event, WebsitePayload, UpdateEventWebsiteDetailsPayload } from '../types/eventTypes';
import { useAuth } from '../context/AuthContext';

export const useEventWebsite = (slug: string | undefined) => {
  const { isAuthenticated } = useAuth();
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
        const eventData = await eventService.getEventBySlug(isAuthenticated, slug);
        if (!eventData) {
          setError('Event not found');
          return;
        }

        setEvent(eventData);

        const websiteData = await eventService.getEventWebsite(isAuthenticated, eventData.id);
        if (websiteData) {
          setWebsiteDetails(websiteData);
        } else {
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
  }, [slug, isAuthenticated]);

  const updateWebsiteDetails = async (updates: UpdateEventWebsiteDetailsPayload): Promise<void> => {
    if (!event?.id) return;

    try {
      const updatedWebsite = await eventService.updateEventWebsite(isAuthenticated, event.id, updates);
      if (updatedWebsite) {
        setWebsiteDetails(updatedWebsite);
      }
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
