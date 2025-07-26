import { useState, useEffect, useCallback } from 'react';
import Cell from './Cell';
import './Board.css';

const BOARD_SIZE = 8;
const MINES_COUNT = 10;

const Board = ({ gameState, onGameStateChange, onFirstClick }) => {
  const [board, setBoard] = useState([]);
  const [minePositions, setMinePositions] = useState(new Set());
  const [revealedCells, setRevealedCells] = useState(new Set());
  const [flaggedCells, setFlaggedCells] = useState(new Set());

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const boardRow = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        boardRow.push({
          row,
          col,
          isMine: false,
          neighborMines: 0,
          isRevealed: false,
          isFlagged: false
        });
      }
      newBoard.push(boardRow);
    }
    setBoard(newBoard);
    setRevealedCells(new Set());
    setFlaggedCells(new Set());
    setMinePositions(new Set());
  }, []);

  // Place mines after first click
  const placeMines = useCallback((firstClickRow, firstClickCol) => {
    const mines = new Set();
    while (mines.size < MINES_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      const pos = `${row}-${col}`;
      
      // Don't place mine on first click or its neighbors
      if (Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1) {
        continue;
      }
      
      mines.add(pos);
    }
    setMinePositions(mines);
    return mines;
  }, []);

  // Calculate neighbor mines
  const calculateNeighborMines = useCallback((row, col, mines) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
          if (mines.has(`${newRow}-${newCol}`)) {
            count++;
          }
        }
      }
    }
    return count;
  }, []);

  // Reveal cell and neighbors if no mines
  const revealCell = useCallback((row, col, mines, revealed = new Set()) => {
    const pos = `${row}-${col}`;
    if (revealed.has(pos) || flaggedCells.has(pos)) return revealed;
    
    revealed.add(pos);
    
    if (!mines.has(pos)) {
      const neighborMines = calculateNeighborMines(row, col, mines);
      if (neighborMines === 0) {
        // Reveal all neighbors
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
              revealCell(newRow, newCol, mines, revealed);
            }
          }
        }
      }
    }
    
    return revealed;
  }, [calculateNeighborMines, flaggedCells]);

  // Handle cell click
  const handleCellClick = useCallback((row, col) => {
    if (gameState === 'won' || gameState === 'lost') return;
    
    const pos = `${row}-${col}`;
    if (revealedCells.has(pos) || flaggedCells.has(pos)) return;

    let mines = minePositions;
    
    // First click - place mines and start timer
    if (gameState === 'idle') {
      mines = placeMines(row, col);
      onFirstClick();
      onGameStateChange('playing');
    }

    const newRevealed = revealCell(row, col, mines);
    setRevealedCells(prev => new Set([...prev, ...newRevealed]));

    // Check if clicked on mine
    if (mines.has(pos)) {
      onGameStateChange('lost');
      // Reveal all mines
      setRevealedCells(prev => new Set([...prev, ...mines]));
    } else {
      // Check win condition
      const totalCells = BOARD_SIZE * BOARD_SIZE;
      if (newRevealed.size + mines.size === totalCells) {
        onGameStateChange('won');
      }
    }
  }, [gameState, revealedCells, flaggedCells, minePositions, placeMines, revealCell, onFirstClick, onGameStateChange]);

  // Handle right click (flag)
  const handleRightClick = useCallback((e, row, col) => {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    
    const pos = `${row}-${col}`;
    if (revealedCells.has(pos)) return;

    setFlaggedCells(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(pos)) {
        newFlagged.delete(pos);
      } else {
        newFlagged.add(pos);
      }
      return newFlagged;
    });
  }, [gameState, revealedCells]);

  // Reset board when game resets
  useEffect(() => {
    if (gameState === 'idle') {
      initializeBoard();
    }
  }, [gameState, initializeBoard]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const pos = `${rowIndex}-${colIndex}`;
            const isRevealed = revealedCells.has(pos);
            const isFlagged = flaggedCells.has(pos);
            const isMine = minePositions.has(pos);
            const neighborMines = isRevealed && !isMine ? 
              calculateNeighborMines(rowIndex, colIndex, minePositions) : 0;

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                isRevealed={isRevealed}
                isMine={isMine}
                isFlagged={isFlagged}
                neighborMines={neighborMines}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onRightClick={(e) => handleRightClick(e, rowIndex, colIndex)}
                gameState={gameState}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
