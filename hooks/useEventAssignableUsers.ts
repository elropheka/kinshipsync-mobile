import { useState, useEffect, useMemo } from 'react';
import { getUserProfileById } from '@/services/userService';
import { UserProfile } from '@/types/userTypes';
import { EventTeam, Guest } from '@/types/eventTypes';

export function useEventAssignableUsers(
  guests: Guest[],
  eventTeams: EventTeam[],
) {
  const [teamMemberProfiles, setTeamMemberProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchTeamMemberProfiles = async () => {
      if (!eventTeams || eventTeams.length === 0) {
        setTeamMemberProfiles([]);
        return;
      }

      try {
        const allUserIds = new Set<string>();
        eventTeams.forEach((team) => {
          (team.members ?? []).forEach((member) => {
            allUserIds.add(member.userId);
          });
        });

        const profilePromises = Array.from(allUserIds).map((userId) =>
          getUserProfileById(userId),
        );
        const profiles = await Promise.all(profilePromises);
        const validProfiles = profiles.filter(
          (profile): profile is UserProfile => profile !== null,
        );
        setTeamMemberProfiles(validProfiles);
      } catch (error) {
        console.error('Error fetching team member profiles:', error);
        setTeamMemberProfiles([]);
      }
    };

    fetchTeamMemberProfiles();
  }, [eventTeams]);

  const assignableUsers: UserProfile[] = useMemo(
    () =>
      guests.map((guest) => ({
        userId: guest.id,
        displayName: guest.name,
        email: guest.email || '',
        createdAt: guest.addedAt || new Date().toISOString(),
        updatedAt: guest.addedAt || new Date().toISOString(),
        avatarUrl: undefined,
      })),
    [guests],
  );

  const uniqueAssignableUsers = useMemo(() => {
    const allAssignableUsers: UserProfile[] = [...assignableUsers, ...teamMemberProfiles];
    return allAssignableUsers.filter(
      (user, index, self) => index === self.findIndex((u) => u.userId === user.userId),
    );
  }, [assignableUsers, teamMemberProfiles]);

  const taskAssignableUsers: UserProfile[] = useMemo(
    () =>
      eventTeams.flatMap((team) =>
        (team.members ?? [])
          .map((member: { userId: string }) =>
            uniqueAssignableUsers.find((user) => user.userId === member.userId),
          )
          .filter((profile): profile is UserProfile => profile !== undefined),
      ),
    [eventTeams, uniqueAssignableUsers],
  );

  return { uniqueAssignableUsers, taskAssignableUsers };
}
