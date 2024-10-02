import axios, { AxiosResponse } from 'axios';

const CURRENTLY_LISTENING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

export async function getCurrentlyListening(token: string) {
  try {
    const response = await axios.get(CURRENTLY_LISTENING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response as AxiosResponse<SpotifyApi.CurrentlyPlayingResponse>;
  } catch (e) {
    console.error('Error getting currently playing', e);
  }

  return null;
}
