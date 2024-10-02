// Got all this from https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

import axios, { AxiosResponse } from 'axios';

import { getLocalStorage } from '../utils/localStorage/localStorage';
import { SPOTIFY_API_BUCKET } from '../utils/localStorage/localStorage.types';
import { CLIENT_ID } from './spotifyLogin';

const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

export type AccessTokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  scope: string;
  expires_in: 3600;
  refresh_token: string;
};

export async function requestSpotifyTokens() {
  const codeVerifier = getLocalStorage(SPOTIFY_API_BUCKET, 'codeVerifier');

  if (!codeVerifier) {
    console.error('Not logged in');
    return null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code && codeVerifier) {
    const response: AxiosResponse<AccessTokenResponse> = await axios.post(
      TOKEN_ENDPOINT,
      {
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
        data: {},
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (response.data !== null) {
      urlParams.delete('code');
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    }
  }

  console.error('Could not get token');
  return null;
}
