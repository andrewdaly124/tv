export type SpotifyStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: string | null;
};

export type SpotifyStoreActions = {
  setTokens: (payload: { accessToken: string; refreshToken: string }) => void;

  clearTokens: () => void;
};

export const DEFAULT_SPOTIFY_STATE: SpotifyStoreState = {
  accessToken: null,
  refreshToken: null,
  tokenExpiry: null,
} as const;
