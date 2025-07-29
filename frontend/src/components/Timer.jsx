import { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ isActive, reset }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (reset) {
      setTime(0);
    }
  }, [reset]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      ⏱️ {formatTime(time)}
    </div>
  );
};

export default Timer;
