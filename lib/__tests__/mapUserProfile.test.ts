import { mapUserProfile } from '@/lib/mapUserProfile';

describe('mapUserProfile', () => {
  const userId = '550e8400-e29b-41d4-a716-446655440000';

  it('derives isVendor from profiles.role when users doc lacks isVendor', () => {
    const profile = mapUserProfile(
      userId,
      {
        userId,
        email: 'vendor@example.com',
        displayName: 'Vendor User',
        isVendor: false,
      },
      {
        userId,
        role: 'vendor',
        email: 'vendor@example.com',
      }
    );

    expect(profile.isVendor).toBe(true);
    expect(profile.role).toBe('vendor');
  });

  it('keeps regular users non-vendor when profiles role is organizer', () => {
    const profile = mapUserProfile(
      userId,
      {
        userId,
        email: 'organizer@example.com',
        displayName: 'Organizer User',
      },
      {
        userId,
        role: 'organizer',
        email: 'organizer@example.com',
      }
    );

    expect(profile.isVendor).toBe(false);
    expect(profile.role).toBe('organizer');
  });

  it('uses users.isVendor when explicitly set', () => {
    const profile = mapUserProfile(
      userId,
      {
        userId,
        email: 'vendor@example.com',
        displayName: 'Vendor User',
        isVendor: true,
        role: 'organizer',
      },
      null
    );

    expect(profile.isVendor).toBe(true);
  });

  it('identifies vendor from profiles-only data for web-registered vendors', () => {
    const profile = mapUserProfile(userId, null, {
      userId,
      role: 'vendor',
      isVendor: true,
      email: 'vendor@example.com',
      displayName: 'Web Vendor',
    });

    expect(profile.isVendor).toBe(true);
    expect(profile.role).toBe('vendor');
    expect(profile.displayName).toBe('Web Vendor');
  });
});
