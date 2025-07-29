import React from 'react';
import Cell from './Cell';
import './Board.css';

const Board = ({ board, onCellClick, onCellRightClick }) => {
  if (!board || board.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              isRevealed={cell.isRevealed}
              isMine={cell.isMine}
              isFlagged={cell.isFlagged}
              neighborMines={cell.neighborCount}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onRightClick={(e) => onCellRightClick(e, rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
