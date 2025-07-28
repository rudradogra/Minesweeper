import React, { useState } from 'react';
import './Auth.css';

const SignUp = ({ onSignUp, onSwitchToSignIn, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.name && formData.email && formData.password) {
      onSignUp({ 
        name: formData.name, 
        email: formData.email 
      });
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-button" onClick={onBackToLanding}>
          ← Back to Home
        </button>
        
        <div className="auth-header">
          <h1>💣 Minesweeper</h1>
          <h2>Sign Up</h2>
          <p>Join the mine sweeping adventure!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign Up
          </button>
        </form>

        <div className="auth-switch">
          <p>Already have an account? 
            <button onClick={onSwitchToSignIn} className="switch-btn">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
