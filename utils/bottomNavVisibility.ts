export type BottomNavTabKey = 'home' | 'events' | 'messages' | 'profile';

const TAB_ROOT_PATHS: Record<BottomNavTabKey, string[]> = {
  home: ['/home'],
  events: ['/all'],
  messages: ['/messages'],
  profile: ['/profile'],
};

export function normalizePathname(pathname: string): string {
  const path = pathname.split('?')[0].replace(/\/$/, '') || '/';
  return path;
}

export function shouldShowBottomNav(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return (
    path === '/home' ||
    path.endsWith('/home') ||
    path === '/all' ||
    path.endsWith('/all') ||
    path === '/profile' ||
    path.endsWith('/profile')
  );
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
  if (path.includes('/home')) {
    return 'home';
  }

  return null;
}

export function isTabRootPath(pathname: string, tab: BottomNavTabKey): boolean {
  const path = normalizePathname(pathname);
  return TAB_ROOT_PATHS[tab].some((root) => path === root || path.endsWith(root));
}
