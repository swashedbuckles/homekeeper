import { useEffect, useState } from 'react';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../lib/apiClient';
import { UI as logger } from '../lib/logger';

export function Home() {
  
  logger.log('homepage');
  const [msg, setMsg] = useState('');
  const context = useAuth();

  useEffect(() => {
    logger.log('homepage Checking auth');
    context.checkAuth()
      .then(() => {});
  }, []);

  const onClick = async () => {
    try {
      const response = await apiRequest('/protected');
      if(response?.message) {
        setMsg(response.message);
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
      if(response?.message) {
        setMsg(response.message);
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
      <div className="hero-section relative">
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
  );
}