import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  clearAuthToken,
  clearAuthUser,
  getAuthToken,
} from '../features/auth/authToken';

import CalendarPage from '../features/calendar/CalendarPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import LearningPage from '../features/learning/LearningPage';

function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getAuthToken()),
  );

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    clearAuthToken();
    clearAuthUser();

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

        <Route
          path="/learning"
          element={
            isAuthenticated ? (
              <LearningPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;