import { LocalStorageBuckets } from './localStorage.types';

export function setLocalStorage<
  B extends keyof LocalStorageBuckets,
  K extends keyof LocalStorageBuckets[B],
>(bucket: B, key: K, value: LocalStorageBuckets[B][K]) {
  const serialized = localStorage.getItem(bucket);
  const data = serialized ? JSON.parse(serialized) : {};
  localStorage.setItem(bucket, JSON.stringify({ ...data, [key]: value }));
}

export function getLocalStorage<
  B extends keyof LocalStorageBuckets,
  K extends keyof LocalStorageBuckets[B],
>(bucket: B, key: K) {
  const serialized = localStorage.getItem(bucket);
  if (serialized === null) {
    return null;
  }
  const data: LocalStorageBuckets[B] = JSON.parse(serialized);
  return data[key] ?? null;
}

export function clearLocalStorage<
  B extends keyof LocalStorageBuckets,
  K extends keyof LocalStorageBuckets[B],
>(bucket: B, key: K) {
  const serialized = localStorage.getItem(bucket);
  if (serialized !== null) {
    const data = JSON.parse(serialized) as LocalStorageBuckets[B];
    delete data[key];
    localStorage.setItem(bucket, JSON.stringify(data));
  }
}
