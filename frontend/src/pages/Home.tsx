import { useState, useEffect } from 'react';
import type { SafeUser } from '@homekeeper/shared';

import { getProfile } from "../lib/api/auth";

export function Home() {
  const [profile, setProfile] = useState<SafeUser | null>();

  useEffect(() => {
    getProfile().then(response => {
      const {data} = response;
      
      setProfile((data as SafeUser) ?? null);
    })
  }, [])

  return (
    <>
      <div>
        <p>Home Page</p>
        <br />
        <pre>
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </>
  )
}