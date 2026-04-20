'use client';

import { useEffect, useState } from 'react';

export default function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="offline-banner">
      <span className="inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--soft)]" />
        Offline · Catalogue available, TDS links require connection
      </span>
    </div>
  );
}
