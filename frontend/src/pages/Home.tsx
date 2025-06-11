import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { apiRequest } from '../lib/apiClient';
import { UI as logger } from '../lib/logger';
export function Home() {
  
  logger.log('homepage');
  const [msg, setMsg] = useState('');
  const context = useAuth();

  useEffect(() => {
    logger.log('homepage Checking auth');
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
      logger.error(error);
      setMsg('What? ' + error);
    }
  };

    const onClickPost = async () => {
    try {
      const response = await apiRequest('/protected', {method: 'POST', body: JSON.stringify({test: '1234'})});
      if(response && response.message) {
        setMsg(response.message)
      } else {
        setMsg('Something went wrong');
      }
    } catch (error) {
      logger.error(error);
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
        
        <Button className="m-1" type="button" onClick={onClick}>Get Protected Route</Button>
        <Button className="m-1" type="button" onClick={onClickPost}>Post Protected Route</Button>

      </div>
    </>
  )
}