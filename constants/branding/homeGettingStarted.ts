export interface GettingStartedStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
  route: string;
}

export interface HomeDiscoverFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const homeWelcomeContent = {
  headline: 'Your family hub awaits',
  tagline:
    'Plan reunions, invite loved ones, and preserve memories — all in one warm, organized place.',
  ctaLabel: 'Create Your First Event',
};

export const gettingStartedSteps: GettingStartedStep[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    step: 1,
    title: 'Create an event',
    description: 'Set up your first reunion, celebration, or family gathering.',
    icon: 'calendar-outline',
    route: '/(events)/createEvent',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678902',
    step: 2,
    title: 'Invite your family',
    description: 'Add guests, track RSVPs, and keep everyone in the loop.',
    icon: 'people-outline',
    route: '/(events)/createEvent',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789013',
    step: 3,
    title: 'Build your family tree',
    description: 'Connect relatives and visualize your family network.',
    icon: 'git-network-outline',
    route: '/(main)/teams',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890124',
    step: 4,
    title: 'Share photos & memories',
    description: 'Upload moments and ideas to cherish together.',
    icon: 'images-outline',
    route: '/(events)/all',
  },
];

export const homeDiscoverFeatures: HomeDiscoverFeature[] = [
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901235',
    icon: 'chatbubbles-outline',
    title: 'Family Chat',
    description: 'Stay connected with group conversations and event updates.',
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012346',
    icon: 'wallet-outline',
    title: 'Budget Tracking',
    description: 'Plan and monitor event costs with shared budget tools.',
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-567890123457',
    icon: 'color-palette-outline',
    title: 'Event Themes',
    description: 'Customize your event website with warm, on-brand styling.',
  },
];
