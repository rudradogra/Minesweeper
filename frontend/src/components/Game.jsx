import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import Board from './Board';
import Timer from './Timer';
import ThemeToggle from './ThemeToggle';
import './Game.css';

const Game = ({ mode = 'beginner', onBackToLanding }) => {
  // Game configuration based on mode
  const getGameConfig = (mode) => {
    switch (mode) {
      case 'beginner':
        return { rows: 8, cols: 8, mines: 10 };
      case 'intermediate':
        return { rows: 16, cols: 16, mines: 40 };
      case 'expert':
        return { rows: 16, cols: 30, mines: 99 };
      default:
        return { rows: 8, cols: 8, mines: 10 };
    }
  };

  const { rows, cols, mines } = getGameConfig(mode);
  
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, won, lost
  const [flagCount, setFlagCount] = useState(mines);
  const [revealedCount, setRevealedCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Update window dimensions for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show confetti when game is won
  useEffect(() => {
    if (gameStatus === 'won') {
      setShowConfetti(true);
      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [gameStatus]);

  // Initialize empty board
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborCount: 0,
          row,
          col
        });
      }
      newBoard.push(currentRow);
    }
    return newBoard;
  }, [rows, cols]);

  // Place mines randomly on the board
  const placeMines = useCallback((board, firstClickRow, firstClickCol) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;
    
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      // Don't place mine on first click or if already has mine
      if (!newBoard[row][col].isMine && !(row === firstClickRow && col === firstClickCol)) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    return newBoard;
  }, [mines, rows, cols]);

  // Calculate neighbor mine counts
  const calculateNeighbors = useCallback((board) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }
    
    return newBoard;
  }, [rows, cols]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setGameStatus('waiting');
    setFlagCount(mines);
    setRevealedCount(0);
    setFirstClick(true);
  }, [initializeBoard, mines]);

  // Initialize game on mount or when mode changes
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Handle cell click
  const handleCellClick = useCallback((row, col) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => row.map(cell => ({ ...cell })));
      
      if (newBoard[row][col].isFlagged || newBoard[row][col].isRevealed) return prevBoard;
      
      // Handle first click
      if (firstClick) {
        const boardWithMines = placeMines(newBoard, row, col);
        const finalBoard = calculateNeighbors(boardWithMines);
        setFirstClick(false);
        setGameStatus('playing');
        
        // Reveal the clicked cell
        const revealedBoard = revealCell(finalBoard, row, col);
        return revealedBoard;
      } else {
        return revealCell(newBoard, row, col);
      }
    });
  }, [gameStatus, firstClick, placeMines, calculateNeighbors]);

  // Reveal cell and adjacent empty cells
  const revealCell = (board, row, col) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const toReveal = [[row, col]];
    const revealed = new Set();
    
    while (toReveal.length > 0) {
      const [currentRow, currentCol] = toReveal.pop();
      const key = `${currentRow}-${currentCol}`;
      
      if (revealed.has(key)) continue;
      revealed.add(key);
      
      if (
        currentRow < 0 || currentRow >= rows ||
        currentCol < 0 || currentCol >= cols ||
        newBoard[currentRow][currentCol].isRevealed ||
        newBoard[currentRow][currentCol].isFlagged
      ) continue;
      
      newBoard[currentRow][currentCol].isRevealed = true;
      
      // If it's a mine, game over
      if (newBoard[currentRow][currentCol].isMine) {
        setGameStatus('lost');
        // Reveal all mines
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (newBoard[i][j].isMine) {
              newBoard[i][j].isRevealed = true;
            }
          }
        }
        break;
      }
      
      // If empty cell, reveal neighbors
      if (newBoard[currentRow][currentCol].neighborCount === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            toReveal.push([currentRow + i, currentCol + j]);
          }
        }
      }
    }
    
    return newBoard;
  };

  // Handle right click (flag/unflag)
  const handleCellRightClick = useCallback((e, row, col) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost') return;
    
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => row.map(cell => ({ ...cell })));
      
      if (newBoard[row][col].isRevealed) return prevBoard;
      
      if (newBoard[row][col].isFlagged) {
        newBoard[row][col].isFlagged = false;
        setFlagCount(prev => prev + 1);
      } else {
        newBoard[row][col].isFlagged = true;
        setFlagCount(prev => prev - 1);
      }
      
      return newBoard;
    });
  }, [gameStatus]);

  // Check for win condition
  useEffect(() => {
    if (gameStatus === 'playing') {
      const totalCells = rows * cols;
      const revealedCells = board.flat().filter(cell => cell.isRevealed).length;
      
      if (revealedCells === totalCells - mines) {
        setGameStatus('won');
      }
    }
  }, [board, gameStatus, mines, rows, cols]);

  const getModeDisplayName = (mode) => {
    switch (mode) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'expert': return 'Expert';
      default: return 'Custom';
    }
  };

  return (
    <div className="game-container">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
        />
      )}
      
      <header className="game-header">
        <button className="back-to-landing" onClick={onBackToLanding}>
          ← Back to Modes
        </button>
        <h1>💣 Minesweeper - {getModeDisplayName(mode)}</h1>
        <ThemeToggle />
      </header>
      
      <div className="game-info">
        <div className="info-panel">
          <div className="mine-count">
            🚩 {flagCount}
          </div>
          <Timer 
            isActive={gameStatus === 'playing'} 
            reset={gameStatus === 'waiting'} 
          />
          <div className="game-status">
            {gameStatus === 'waiting' && '😊'}
            {gameStatus === 'playing' && '😐'}
            {gameStatus === 'won' && '😎'}
            {gameStatus === 'lost' && '😵'}
          </div>
        </div>
        
        <button className="reset-btn" onClick={resetGame}>
          New Game
        </button>
      </div>
      
      <div className="game-board-container">
        <Board
          board={board}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />
      </div>
      
      {gameStatus === 'won' && (
        <div className="game-message win">
          🎉 Congratulations! You won! 🎉
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="game-message lose">
          💥 Game Over! Better luck next time! 💥
        </div>
      )}
    </div>
  );
};

export default Game;
