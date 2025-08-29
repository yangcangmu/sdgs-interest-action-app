'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
        // console.log('[sw] registered');
      } catch (e) {
        console.error('[sw] register failed', e);
      }
    };

    // Safari iOS等の挙動も考慮し遅延登録
    const id = setTimeout(register, 500);
    return () => clearTimeout(id);
  }, []);

  return null;
}
