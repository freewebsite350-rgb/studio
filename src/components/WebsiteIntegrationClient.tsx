'use client';
import React, { useEffect, useState } from 'react';
import { initFirebaseClient } from '@/lib/initFirebaseClient';

export default function WebsiteIntegrationClient() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      initFirebaseClient();
    } catch (err) {
      // Guard against runtime issues; we don't want to crash the client
      console.error('Firebase init error (client):', err);
    } finally {
      setReady(true);
    }
  }, []);

  return (
    <div>
      <h1>Website Integration</h1>
      {!ready && <p>Initializing client...</p>}
      {ready && <p>Client ready.</p>}
    </div>
  );
}