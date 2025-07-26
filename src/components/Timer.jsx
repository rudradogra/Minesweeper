import { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ gameState, onReset }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'idle') {
      setTime(0);
    }
  }, [gameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusEmoji = () => {
    switch (gameState) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      case 'playing':
        return '😐';
      default:
        return '🙂';
    }
  };

  return (
    <div className="timer-container">
      <div className="game-info">
        <div className="timer">
          ⏱️ {formatTime(time)}
        </div>
        <button 
          className="reset-button"
          onClick={onReset}
          title="Reset Game"
        >
          {getStatusEmoji()}
        </button>
        <div className="mines-count">
          💣 10
        </div>
      </div>
    </div>
  );
};

export default Timer;
