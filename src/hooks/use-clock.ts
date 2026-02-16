import { useSyncExternalStore } from 'react';

let timestamp = Date.now();
const listeners = new Set<() => void>();

let intervalId: ReturnType<typeof setInterval> | null = null;

function startClock(): void {
  if (intervalId !== null) return;
  intervalId = setInterval(() => {
    timestamp = Date.now();
    listeners.forEach((listener) => listener());
  }, 1_000);
}

function stopClock(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  if (listeners.size === 1) {
    timestamp = Date.now();
    startClock();
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      stopClock();
    }
  };
}

function getSnapshot(): number {
  return timestamp;
}

function getServerSnapshot(): number {
  return 0;
}

export function useClock(): Date {
  const ts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return new Date(ts);
}
