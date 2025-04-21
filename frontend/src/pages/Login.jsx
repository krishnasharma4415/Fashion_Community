import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import '../Styles/Auth.css';

const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
  
    if (!email || !password) {
=======

    // Simulate login
    if (email && password) {
      localStorage.setItem('authToken', 'dummy-token');
      setIsAuthenticated(true);
      navigate('/Home', { replace: true });
    } else {
>>>>>>> 488586a4e106d07ea747b4ccfbd49832c2194c19
      setError('Please fill all fields!');
      return;
    }
  
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem('authToken', data.token); // Save the token
        setIsAuthenticated(true);
        navigate('/Home', { replace: true });
      } else {
        setError(data.message || 'Login failed!');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button> 
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;