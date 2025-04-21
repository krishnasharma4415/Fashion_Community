import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill all fields!');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
  
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setIsSuccess(true);
        setError('');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Signup failed!');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };
  

  if (isSuccess) {
    return (
      <div className="auth-form animate-slideup">
        <div className="success-message">
          <h2>🎉 Account Created!</h2>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form animate-slideup">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;