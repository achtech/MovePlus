export const USER_AVATARS = [
  'avatar-1.jpg',
  'avatar-2.jpg',
  'avatar-3.jpg',
  'avatar-4.jpg',
  'avatar-5.jpg'
] as const;

export type UserAvatar = (typeof USER_AVATARS)[number];

export function avatarImagePath(filename: string): string {
  return `assets/images/user/${filename}`;
}

export function userDisplayName(user: { firstName?: string; lastName?: string; username?: string }): string {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  return name || user.username || '';
}
