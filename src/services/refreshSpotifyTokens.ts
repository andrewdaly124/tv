// Got all this from https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

import axios, { AxiosResponse } from 'axios';

import { AccessTokenResponse } from './requestSpotifyTokens';
import { CLIENT_ID } from './spotifyLogin';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

export async function refreshSpotifyToken(refreshToken: string) {
  const response: AxiosResponse<AccessTokenResponse> = await axios.post(
    TOKEN_ENDPOINT,
    {
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (response.data !== null) {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  }

  console.error('Could not refresh token');
  return null;
}
