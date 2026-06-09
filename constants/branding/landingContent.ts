export interface LandingFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const landingBrandName = {
  line1: 'KINSHIP',
  line2: 'SYNC',
};

export const landingBrandSubtitle = 'Your ultimate event planner and beyond!';

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
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678902',
    icon: 'people-outline',
    title: 'Guest Management',
    description: 'Track RSVPs, dietary needs, and seating for every celebration.',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789013',
    icon: 'chatbubbles-outline',
    title: 'Family Chat',
    description: 'Stay connected with group conversations and event updates.',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890124',
    icon: 'wallet-outline',
    title: 'Budget Tracking',
    description: 'Plan and monitor event costs with shared budget tools.',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901235',
    icon: 'git-network-outline',
    title: 'Family Tree',
    description: 'Visualize relationships and keep your family network organized.',
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012346',
    icon: 'color-palette-outline',
    title: 'Event Themes',
    description: 'Customize your event website with warm, on-brand styling.',
  },
];
