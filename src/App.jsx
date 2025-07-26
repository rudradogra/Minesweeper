import { useState, useEffect } from 'react';
import Board from './components/Board';
import Timer from './components/Timer';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle first click to start the game
  const handleFirstClick = () => {
    setGameState('playing');
  };

  // Reset the game
  const resetGame = () => {
    setGameState('idle');
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const getGameMessage = () => {
    switch (gameState) {
      case 'won':
        return '🎉 Congratulations! You won! 🎉';
      case 'lost':
        return '💥 Game Over! Better luck next time! 💥';
      case 'playing':
        return 'Good luck! Left click to reveal, right click to flag.';
      default:
        return 'Click any cell to start playing!';
    }
  };

  return (
    <div className="app">
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      
      <div className="game-container">
        <h1 className="game-title">💣 Minesweeper 💣</h1>
        
        <Timer 
          gameState={gameState} 
          onReset={resetGame} 
        />
        
        <div className="game-message">
          {getGameMessage()}
        </div>
        
        <Board 
          gameState={gameState}
          onGameStateChange={setGameState}
          onFirstClick={handleFirstClick}
        />
        
        <div className="instructions">
          <h3>How to Play:</h3>
          <ul>
            <li>🖱️ <strong>Left click</strong> to reveal a cell</li>
            <li>🖱️ <strong>Right click</strong> to flag/unflag a cell</li>
            <li>💣 Avoid clicking on mines!</li>
            <li>🔢 Numbers show how many mines are nearby</li>
            <li>🏆 Reveal all non-mine cells to win!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;