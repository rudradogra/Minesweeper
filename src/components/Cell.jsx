import './Cell.css';

const Cell = ({ 
  isRevealed, 
  isMine, 
  isFlagged, 
  neighborMines, 
  onClick, 
  onRightClick
}) => {
  const getCellContent = () => {
    if (isFlagged) {
      return '🚩';
    }
    
    if (!isRevealed) {
      return '';
    }
    
    if (isMine) {
      return '💣';
    }
    
    if (neighborMines > 0) {
      return neighborMines;
    }
    
    return '';
  };

  const getCellClass = () => {
    let className = 'cell';
    
    if (isRevealed) {
      className += ' revealed';
      if (isMine) {
        className += ' mine';
      }
    } else {
      className += ' hidden';
    }
    
    if (isFlagged) {
      className += ' flagged';
    }
    
    if (neighborMines > 0 && isRevealed && !isMine) {
      className += ` mines-${neighborMines}`;
    }
    
    return className;
  };

  return (
    <button
      className={getCellClass()}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {getCellContent()}
    </button>
  );
};

export default Cell;
