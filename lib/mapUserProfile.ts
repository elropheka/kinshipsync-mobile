import type { UserProfile } from '@/types/userTypes';

type RawProfileData = Record<string, unknown>;

function normalizeTimestamp(value: unknown): string {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function resolveRole(
  usersData: RawProfileData,
  profilesData: RawProfileData
): UserProfile['role'] {
  const role =
    (profilesData.role as UserProfile['role']) ||
    (usersData.role as UserProfile['role']);
  return role || 'organizer';
}

export function mapUserProfile(
  userId: string,
  usersData: RawProfileData | null,
  profilesData: RawProfileData | null
): UserProfile {
  const merged: RawProfileData = {
    ...(profilesData ?? {}),
    ...(usersData ?? {}),
  };

  const role = resolveRole(usersData ?? {}, profilesData ?? {});

  const usersIsVendor = usersData?.isVendor;
  const profilesIsVendor = profilesData?.isVendor;
  const usersIsAdmin = usersData?.isAdmin;
  const profilesIsAdmin = profilesData?.isAdmin;

  const createdAt = normalizeTimestamp(
    usersData?.createdAt ?? profilesData?.createdAt
  );
  const updatedAt = normalizeTimestamp(
    usersData?.updatedAt ?? profilesData?.updatedAt
  );

  const firstName =
    (merged.firstName as string | undefined) ||
    (merged.first_name as string | undefined) ||
    (merged.firstname as string | undefined);
  const lastName =
    (merged.lastName as string | undefined) ||
    (merged.last_name as string | undefined) ||
    (merged.lastname as string | undefined);

  const displayName =
    (merged.displayName as string | undefined) ||
    (merged.display_name as string | undefined) ||
    (merged.displayname as string | undefined) ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    '';

  return {
    ...merged,
    userId: (merged.userId as string) || userId,
    firstName,
    lastName,
    displayName,
    email: (merged.email as string) ?? '',
    avatarUrl:
      (merged.avatarUrl as string | undefined) ||
      (merged.avatar_url as string | undefined),
    phoneNumber:
      (merged.phoneNumber as string | undefined) ||
      (merged.phone_number as string | undefined) ||
      (merged.phone as string | undefined),
    dateOfBirth:
      (merged.dateOfBirth as string | undefined) ||
      (merged.date_of_birth as string | undefined),
    bio: merged.bio as string | undefined,
    address: merged.address as UserProfile['address'],
    fcmTokens: (merged.fcmTokens as string[] | undefined) ?? [],
    oneSignalSubscriptionIds: merged.oneSignalSubscriptionIds as
      | string[]
      | undefined,
    role,
    isAdmin:
      usersIsAdmin === true ||
      profilesIsAdmin === true ||
      role === 'admin',
    isVendor:
      usersIsVendor === true ||
      profilesIsVendor === true ||
      role === 'vendor',
    createdAt,
    updatedAt,
  } as UserProfile;
}
