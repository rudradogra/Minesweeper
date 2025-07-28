import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import Game from './components/Game';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, game, signin, signup
  const [selectedMode, setSelectedMode] = useState('beginner');
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('minesweeper-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('minesweeper-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSelectMode = (mode) => {
    if (mode === 'custom') {
      // For now, default to beginner for custom mode
      // You could add a custom mode configuration dialog here
      setSelectedMode('beginner');
    } else {
      setSelectedMode(mode);
    }
    setCurrentPage('game');
  };

  const handleSignIn = (userData) => {
    setUser(userData);
    localStorage.setItem('minesweeper-user', JSON.stringify(userData));
    setCurrentPage('landing');
  };

  const handleSignUp = (userData) => {
    setUser(userData);
    localStorage.setItem('minesweeper-user', JSON.stringify(userData));
    setCurrentPage('landing');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('minesweeper-user');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleGoToSignIn = () => {
    setCurrentPage('signin');
  };

  const handleGoToSignUp = () => {
    setCurrentPage('signup');
  };

  const handleSwitchToSignUp = () => {
    setCurrentPage('signup');
  };

  const handleSwitchToSignIn = () => {
    setCurrentPage('signin');
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onSelectMode={handleSelectMode}
            onSignIn={handleGoToSignIn}
            onSignUp={handleGoToSignUp}
            user={user}
            onSignOut={handleSignOut}
          />
        );
      case 'game':
        return (
          <Game
            mode={selectedMode}
            onBackToLanding={handleBackToLanding}
          />
        );
      case 'signin':
        return (
          <SignIn
            onSignIn={handleSignIn}
            onSwitchToSignUp={handleSwitchToSignUp}
            onBackToLanding={handleBackToLanding}
          />
        );
      case 'signup':
        return (
          <SignUp
            onSignUp={handleSignUp}
            onSwitchToSignIn={handleSwitchToSignIn}
            onBackToLanding={handleBackToLanding}
          />
        );
      default:
        return (
          <LandingPage
            onSelectMode={handleSelectMode}
            onSignIn={handleGoToSignIn}
            onSignUp={handleGoToSignUp}
            user={user}
            onSignOut={handleSignOut}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;