import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { getCurrentlyListening } from '../../../services/getCurrentlyListening';
import { refreshSpotifyToken } from '../../../services/refreshSpotifyTokens';
import { requestSpotifyTokens } from '../../../services/requestSpotifyTokens';
import { spotifyLogin } from '../../../services/spotifyLogin';
import { useSpotifyStore } from '../../../zustand';
import styles from './DumbSpotifyComponent.module.scss';

export function DumbSpotifyComponent() {
  const accessToken = useSpotifyStore((state) => state.accessToken);
  const refreshToken = useSpotifyStore((state) => state.refreshToken);

  const tokenExpiry = useSpotifyStore((state) => state.tokenExpiry);

  const setTokens = useSpotifyStore((state) => state.setTokens);
  const clearTokens = useSpotifyStore((state) => state.clearTokens);

  async function requestAccessToken() {
    const tokenRequest = await requestSpotifyTokens();
    if (tokenRequest !== null) {
      setTokens(tokenRequest);
    } else {
      console.error("Failed to get access token, so didn't set");
    }
  }

  useEffect(() => {
    if (!refreshToken || !tokenExpiry) {
      console.log('No token to refresh');
      return;
    }

    const now = dayjs(new Date());
    const expiry = dayjs(tokenExpiry);

    if (dayjs(tokenExpiry).isBefore(now)) {
      console.log('Token expired');
      return;
    }

    const timeToExpiry = expiry.diff(now) - 5000; // -5000ms to give a little buffer

    console.log('Refresing in ', Math.floor(timeToExpiry / 60000), 's');

    const timeout = setTimeout(async () => {
      const tokenRequest = await refreshSpotifyToken(refreshToken);
      if (tokenRequest !== null) {
        setTokens(tokenRequest);
      } else {
        console.error("Failed to get access token, so didn't set");
      }
    }, timeToExpiry);

    return () => clearTimeout(timeout);
  }, [refreshToken, setTokens, tokenExpiry]);

  return (
    <div className={styles.login}>
      <div className={styles.buttons}>
        {accessToken ? (
          <button onClick={clearTokens}>Logout</button>
        ) : (
          <button onClick={spotifyLogin}>Login</button>
        )}
        <button disabled={!!accessToken} onClick={requestAccessToken}>
          Request Access Token
        </button>
      </div>
      <div>
        {accessToken && refreshToken
          ? `Logged in! Your access token starts with ${accessToken.slice(0, 8)} and your refresh token starts with ${refreshToken.slice(0, 8)}`
          : 'No access token / not logged in'}
      </div>
      <CurrentlyListeningButton />
    </div>
  );
}

function CurrentlyListeningButton() {
  const accessToken = useSpotifyStore((state) => state.accessToken);

  const [loading, setLoading] = useState(false);
  const [songName, setSongName] = useState<string | null>(null);
  const [artistName, setArtistName] = useState<string | null>(null);

  if (!accessToken) {
    return null;
  }

  async function whatAmIListeningTo() {
    if (!accessToken) {
      return;
    }

    setLoading(true);

    const response = await getCurrentlyListening(accessToken);

    if (response?.data?.item) {
      setSongName(response.data.item.name);
      if ('artists' in response.data.item) {
        setArtistName(response.data.item.artists[0].name);
      }
    }

    setLoading(false);
  }

  return (
    <div className={styles.current}>
      <button onClick={whatAmIListeningTo}>
        {loading ? 'Loading...' : 'What am I listening to now?'}
      </button>
      <>
        {songName && (
          <>
            {songName} {artistName && ` by ${artistName}`}, Nice!
          </>
        )}
      </>
    </div>
  );
}
