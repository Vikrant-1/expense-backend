export const userPath = (userId: string) => `users/${userId}`;

export const userSpacePath = (userId: string, spaceId: string) =>
  `v1/users/${userId}/spaces/${spaceId}`;

export const spacePath = (spaceId: string) => `spaces/${spaceId}`;
