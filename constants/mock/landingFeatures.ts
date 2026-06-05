export interface LandingFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  imageUri: string;
}

export const landingBrandMessage = {
  headline: 'Bring families together',
  tagline:
    'Your warm, organized home for reunions, events, and cherished family moments—all in one place.',
};

export const landingFeatures: LandingFeature[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    icon: 'calendar-outline',
    title: 'Event Creation',
    description: 'Create and manage family reunions, celebrations, and gatherings with ease.',
    imageUri: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678902',
    icon: 'people-outline',
    title: 'Guest Management',
    description: 'Organize your guest list, track RSVPs, and keep everyone in the loop.',
    imageUri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    icon: 'time-outline',
    title: 'Smart Scheduling',
    description: 'Plan timelines and schedules so every moment runs smoothly.',
    imageUri: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    icon: 'wallet-outline',
    title: 'Budget Tracking',
    description: 'Keep track of expenses and stay on budget for every occasion.',
    imageUri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
    icon: 'chatbubbles-outline',
    title: 'Team Communication',
    description: 'Stay connected with family and friends as you plan together.',
    imageUri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    icon: 'globe-outline',
    title: 'Custom Websites',
    description: 'Beautiful, customizable event pages your family will love.',
    imageUri: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
];
