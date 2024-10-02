// Got all this from https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

import { setLocalStorage } from '../utils/localStorage/localStorage';
import { SPOTIFY_API_BUCKET } from '../utils/localStorage/localStorage.types';

export const CLIENT_ID = '05595941c4c140c48c4f209d346e7f69';
const SCOPE =
  'user-read-private user-read-email user-library-read user-read-currently-playing';
const AUTH_URL = new URL('https://accounts.spotify.com/authorize');
const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI;

const generateRandomString = (length: number) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export async function spotifyLogin() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  setLocalStorage(SPOTIFY_API_BUCKET, 'codeVerifier', codeVerifier);

  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  AUTH_URL.search = new URLSearchParams(params).toString();
  window.location.href = AUTH_URL.toString();
}
