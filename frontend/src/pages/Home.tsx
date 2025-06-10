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
      <div className='hero-section relative'>
          <div className="absolute w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-primary/8 top-[10%] right-[5%] pointer-events-none -z-10"></div>
          <div className="absolute w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-secondary/6 bottom-[15%] right-[12%] pointer-events-none -z-10"></div>
        <p>Home Page</p>
        <br />
        <pre>
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </>
  )
}