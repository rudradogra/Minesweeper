import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onSelectMode, onSignIn, onSignUp, user, onSignOut }) => {
  const gameModes = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: '8×8 grid, 10 mines',
      icon: '🟢',
      difficulty: 'Easy',
      grid: '8×8',
      mines: 10
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: '16×16 grid, 40 mines',
      icon: '🟡',
      difficulty: 'Medium',
      grid: '16×16',
      mines: 40
    },
    {
      id: 'expert',
      name: 'Expert',
      description: '30×16 grid, 99 mines',
      icon: '🔴',
      difficulty: 'Hard',
      grid: '30×16',
      mines: 99
    },
    {
      id: 'random',
      name: 'Random',
      description: 'Unpredictable challenge - mines unknown!',
      icon: '🎲',
      difficulty: 'Mystery',
      grid: 'Random',
      mines: '???'
    }
  ];

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <h1>💣 Minesweeper</h1>
            <p>The classic puzzle game, reimagined</p>
          </div>
          
          <div className="auth-buttons">
            {user ? (
              <div className="user-info">
                <span className="welcome-text">Welcome, {user.name}!</span>
                <button onClick={onSignOut} className="auth-btn secondary">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button onClick={onSignIn} className="auth-btn secondary">
                  Sign In
                </button>
                <button onClick={onSignUp} className="auth-btn primary">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero">
          <h2>Choose Your Challenge</h2>
          <p>Test your logic and luck in this timeless game of strategy</p>
        </section>

        <section className="game-modes">
          <div className="modes-grid">
            {gameModes.map((mode) => (
              <div key={mode.id} className="mode-card" onClick={() => onSelectMode(mode.id)}>
                <div className="mode-icon">{mode.icon}</div>
                <h3>{mode.name}</h3>
                <p className="mode-description">{mode.description}</p>
                
                <div className="mode-stats">
                  <div className="stat">
                    <span className="stat-label">Difficulty</span>
                    <span className="stat-value">{mode.difficulty}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Grid</span>
                    <span className="stat-value">{mode.grid}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Mines</span>
                    <span className="stat-value">{mode.mines}</span>
                  </div>
                </div>
                
                <button className="play-btn">
                  Play Now
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="features">
          <h3>Game Features</h3>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">⏱️</div>
              <h4>Timer</h4>
              <p>Track your solving time and improve your speed</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🌓</div>
              <h4>Dark Mode</h4>
              <p>Switch between light and dark themes for comfortable play</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🚩</div>
              <h4>Smart Flagging</h4>
              <p>Right-click to flag suspected mines</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎯</div>
              <h4>Multiple Modes</h4>
              <p>From beginner to expert, find your perfect challenge</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2025 Minesweeper. Built with React & ❤️</p>
      </footer>
    </div>
  );
};

export default LandingPage;
