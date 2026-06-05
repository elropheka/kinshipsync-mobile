import {
  getActiveBottomNavTab,
  normalizePathname,
  shouldShowBottomNav,
} from '../bottomNavVisibility';

describe('bottomNavVisibility', () => {
  describe('normalizePathname', () => {
    it('returns root for non-string pathnames', () => {
      expect(normalizePathname(undefined)).toBe('/');
      expect(normalizePathname(null)).toBe('/');
      expect(normalizePathname(123)).toBe('/');
    });

    it('normalizes string pathnames', () => {
      expect(normalizePathname('/home/')).toBe('/home');
      expect(normalizePathname('/(main)/home?tab=1')).toBe('/(main)/home');
    });
  });

  describe('shouldShowBottomNav', () => {
    it('shows bottom nav on known roots', () => {
      expect(shouldShowBottomNav('/home')).toBe(true);
      expect(shouldShowBottomNav('/all')).toBe(true);
      expect(shouldShowBottomNav('/(events)/details/abc')).toBe(false);
    });

    it('handles invalid pathnames safely', () => {
      expect(shouldShowBottomNav(undefined)).toBe(false);
    });
  });

  describe('getActiveBottomNavTab', () => {
    it('maps known routes to tabs', () => {
      expect(getActiveBottomNavTab('/home')).toBe('home');
      expect(getActiveBottomNavTab('/all')).toBe('events');
      expect(getActiveBottomNavTab('/messages')).toBe('messages');
      expect(getActiveBottomNavTab('/profile')).toBe('profile');
    });

    it('returns null for unknown routes', () => {
      expect(getActiveBottomNavTab('/createEvent')).toBeNull();
      expect(getActiveBottomNavTab(undefined)).toBeNull();
    });
  });
});
