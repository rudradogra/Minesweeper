import React, { useState } from 'react';
import './Auth.css';

const SignIn = ({ onSignIn, onSwitchToSignUp, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically validate credentials
    // For now, we'll just simulate a successful sign in
    if (formData.email && formData.password) {
      onSignIn({ email: formData.email, name: formData.email.split('@')[0] });
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
          <h2>Sign In</h2>
          <p>Welcome back! Ready to sweep some mines?</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign In
          </button>
        </form>

        <div className="auth-switch">
          <p>Don't have an account? 
            <button onClick={onSwitchToSignUp} className="switch-btn">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
