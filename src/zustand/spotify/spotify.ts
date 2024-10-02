import dayjs from 'dayjs';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  clearLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from '../../utils/localStorage/localStorage';
import { SPOTIFY_API_BUCKET } from '../../utils/localStorage/localStorage.types';
import {
  DEFAULT_SPOTIFY_STATE,
  SpotifyStoreActions,
  SpotifyStoreState,
} from './spotify.types';

export const useSpotifyStore = create<
  SpotifyStoreState & SpotifyStoreActions
>()(
  immer(
    devtools((set) => ({
      ...initializeSpotifyStore(),

      setTokens: ({ accessToken, refreshToken }) =>
        set((state) => {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.tokenExpiry = dayjs(Date.now()).add(1, 'hour').toISOString();

          setLocalStorage(SPOTIFY_API_BUCKET, 'accessToken', state.accessToken);
          setLocalStorage(
            SPOTIFY_API_BUCKET,
            'refreshToken',
            state.refreshToken
          );
          setLocalStorage(SPOTIFY_API_BUCKET, 'tokenExpiry', state.tokenExpiry);
        }),

      clearTokens: () => {
        set((state) => {
          state.accessToken = null;
          state.refreshToken = null;
          state.tokenExpiry = null;

          clearLocalStorage(SPOTIFY_API_BUCKET, 'accessToken');
          clearLocalStorage(SPOTIFY_API_BUCKET, 'refreshToken');
          clearLocalStorage(SPOTIFY_API_BUCKET, 'tokenExpiry');
        });
      },
    }))
  )
);

function initializeSpotifyStore() {
  const state = structuredClone(DEFAULT_SPOTIFY_STATE);

  const accessToken = getLocalStorage(SPOTIFY_API_BUCKET, 'accessToken');
  const refreshToken = getLocalStorage(SPOTIFY_API_BUCKET, 'refreshToken');
  const tokenExpiry = getLocalStorage(SPOTIFY_API_BUCKET, 'tokenExpiry');

  const anHourFromNow = dayjs(Date.now()).add(1, 'hour');

  if (
    refreshToken &&
    accessToken &&
    tokenExpiry &&
    dayjs(tokenExpiry).isBefore(anHourFromNow)
  ) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.tokenExpiry = tokenExpiry;
  }

  return state;
}
