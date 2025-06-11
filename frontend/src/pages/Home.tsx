import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  console.log('homepage');
  const context = useAuth();

  useEffect(() => {
    console.log('homepage Checking auth');
    context.checkAuth()
      .then(() => {})
  }, [])

  return (
    <>
      <div className='hero-section relative'>
          <div className="absolute w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-primary/8 top-[10%] right-[5%] pointer-events-none -z-10"></div>
          <div className="absolute w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-secondary/6 bottom-[15%] right-[12%] pointer-events-none -z-10"></div>
        <p>Home Page</p>
        <br />
        <pre>
          {JSON.stringify(context.user, null, 2)}
        </pre>
      </div>
    </>
  )
}