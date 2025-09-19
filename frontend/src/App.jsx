import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Leads from './pages/Leads';
import api from './api';

function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);
  useEffect(() => {
    let mounted = true;
    api.get('/auth/me')
      .then(() => mounted && setOk(true))
      .catch(() => mounted && setOk(false));
    return () => mounted = false;
  }, []);
  if (ok === null) return <div>Loading...</div>;
  return ok ? children : <Navigate to='/login' />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/leads" element={
        <ProtectedRoute>
          <Leads />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/leads" />} />
    </Routes>
  );
}
