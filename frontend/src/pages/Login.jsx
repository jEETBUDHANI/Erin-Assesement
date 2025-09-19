import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/auth/login', { email, password });
      navigate('/leads');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="center">
      <form className="card" onSubmit={submit}>
        <h2>Login</h2>
        {error && <div className="err">{error}</div>}
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
        <div style={{marginTop:10}}>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
