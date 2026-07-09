import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import CalendarPage from '../features/calendar/CalendarPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/app"
          element={
            isAuthenticated ? (
              <CalendarPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        <Route
          path="/register"
          element={<RegisterPage onRegister={handleLogin} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;