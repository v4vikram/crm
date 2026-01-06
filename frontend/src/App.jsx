import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Layout from './layout/Layout';
import Leads from './pages/Leads';
import useAuthStore from './features/auth/authStore';
import { useEffect } from 'react';
import Staff from './pages/Staff';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/leads" />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/staff" element={<Staff />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
