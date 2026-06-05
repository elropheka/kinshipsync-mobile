export interface MockAttendingMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface MockGalleryPhoto {
  id: string;
  uri: string;
  caption: string;
}

export interface MockFeaturedEvent {
  id: string;
  title: string;
  subtitle: string;
  imageUri: string;
}

export const mockFeaturedEvent: MockFeaturedEvent = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title: 'Family Reunion 2025',
  subtitle: 'Smith Family Gathering',
  imageUri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
};

export const mockAttendingMembers: MockAttendingMember[] = [
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Maya' },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', name: 'James' },
  { id: 'd4e5f6a7-b8c9-0123-def0-234567890123', name: 'Ava' },
  { id: 'e5f6a7b8-c9d0-1234-ef01-345678901234', name: 'Noah' },
];

import { Event } from '@/types/eventTypes';

export const mockUpcomingEvents: Event[] = [
  {
    id: 'd1e2f3a4-b5c6-7890-def1-234567890abc',
    name: 'Note',
    date: '2025-10-28',
    time: '11:03 PM',
    location: 'Accra',
    description: 'Family gathering',
    organizerId: 'mock-organizer',
    visibility: 'private',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'e2f3a4b5-c6d7-8901-ef12-345678901bcd',
    name: 'Summer BBQ',
    date: '2025-11-15',
    time: '2:00 PM',
    location: 'Backyard',
    description: 'Annual family BBQ',
    organizerId: 'mock-organizer',
    visibility: 'private',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'f3a4b5c6-d7e8-9012-f123-456789012cde',
    name: 'Holiday Dinner',
    date: '2025-12-24',
    time: '6:00 PM',
    location: 'Home',
    description: 'Christmas Eve dinner',
    organizerId: 'mock-organizer',
    visibility: 'private',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

export const mockGalleryPhotos: MockGalleryPhoto[] = [
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    caption: 'Reunion picnic',
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-567890123456',
    uri: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80',
    caption: 'Birthday dinner',
  },
  {
    id: 'b8c9d0e1-f2a3-4567-1234-678901234567',
    uri: 'https://images.unsplash.com/photo-1464203486825-3a09d2a86d03?w=400&q=80',
    caption: 'Holiday table',
  },
  {
    id: 'c9d0e1f2-a3b4-5678-2345-789012345678',
    uri: 'https://images.unsplash.com/photo-1522673607200-164d1b6d486c?w=400&q=80',
    caption: 'Family walk',
  },
];
