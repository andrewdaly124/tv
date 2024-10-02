const TEMP_BUCKET = 'temp' as const;
const SPOTIFY_API_BUCKET_V1 = 'SPOTIFY_AUTH_V1' as const;

type SpotifyBucketV1 = {
  codeVerifier?: string;
  accessToken?: string;
  refreshToken?: string;
  /** ISO String */
  tokenExpiry?: string;
};

export const SPOTIFY_API_BUCKET = SPOTIFY_API_BUCKET_V1;
export type SpotifyBucket = SpotifyBucketV1;

export type LocalStorageBuckets = {
  [TEMP_BUCKET]: { [k: string]: unknown };
  [SPOTIFY_API_BUCKET_V1]: SpotifyBucket;
};
