import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css'; 

function SignupPage() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://brewery-review-system-backend-dwxz.onrender.com/register', { username, password });
      setError('');
      navigate('/');
    } catch (error) {
      setError('Username already exists');
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup Page</h1>
      <form onSubmit={handleSignup}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Signup</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>Already have an account? <Link to="/" className="login-link">Login</Link></p>
    </div>
  );
}

export default SignupPage;
