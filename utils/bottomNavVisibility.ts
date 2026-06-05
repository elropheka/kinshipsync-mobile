export type BottomNavTabKey = 'home' | 'events' | 'messages' | 'profile';

const TAB_ROOT_PATHS: Record<BottomNavTabKey, string[]> = {
  home: ['/home'],
  events: ['/all'],
  messages: ['/messages'],
  profile: ['/profile'],
};

/** Paths where the global bottom nav bar stays visible. */
const BOTTOM_NAV_VISIBLE_SUFFIXES = [
  '/home',
  '/all',
  '/messages',
  '/profile',
  '/teams',
  '/notifications',
  '/settings',
];

export function normalizePathname(pathname: string): string {
  const path = pathname.split('?')[0].replace(/\/$/, '') || '/';
  return path;
}

function pathMatchesSuffix(path: string, suffix: string): boolean {
  return path === suffix || path.endsWith(suffix);
}

export function shouldShowBottomNav(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return BOTTOM_NAV_VISIBLE_SUFFIXES.some((suffix) => pathMatchesSuffix(path, suffix));
}

export function getActiveBottomNavTab(pathname: string): BottomNavTabKey | null {
  const path = normalizePathname(pathname);

  if (path.includes('/messages') || path.includes('/chatArea') || path.includes('/newChat')) {
    return 'messages';
  }
  if (path.includes('/all')) {
    return 'events';
  }
  if (path.includes('/profile')) {
    return 'profile';
  }
  if (path.includes('/home') || path.includes('/teams') || path.includes('/notifications') || path.includes('/settings')) {
    return 'home';
  }

  return null;
}

export function isTabRootPath(pathname: string, tab: BottomNavTabKey): boolean {
  const path = normalizePathname(pathname);
  return TAB_ROOT_PATHS[tab].some((root) => path === root || path.endsWith(root));
}
