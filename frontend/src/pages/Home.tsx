import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { apiRequest } from '../lib/apiClient';

export function Home() {
  console.log('homepage');
  const [msg, setMsg] = useState('');
  const context = useAuth();

  useEffect(() => {
    console.log('homepage Checking auth');
    context.checkAuth()
      .then(() => {})
  }, [])

  const onClick = async () => {
    try {
      const response = await apiRequest('/protected');
      if(response && response.message) {
        setMsg(response.message)
      } else {
        setMsg('Something went wrong');
      }
    } catch (error) {
      console.error(error);
      setMsg('What? ' + error);
    }
  };

  return (
    <>
      <div className='hero-section relative'>
          <div className="absolute w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-primary/8 top-[10%] right-[5%] pointer-events-none -z-10"></div>
          <div className="absolute w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-secondary/6 bottom-[15%] right-[12%] pointer-events-none -z-10"></div>
        <p>Home Page</p>
        <br />
        <pre>
          {JSON.stringify(context.user, null, 2)}
          {msg}
        </pre>
        <Button type="button" onClick={onClick}>Test Protected Route</Button>
      </div>
    </>
  )
}