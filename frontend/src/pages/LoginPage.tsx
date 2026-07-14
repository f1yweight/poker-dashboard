import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../features/auth/authApi';
import { setAuthToken, setAuthUser } from '../features/auth/authToken';

type LoginFormData = {
  email: string;
  password: string;
};

type LoginPageProps = {
  onLogin: () => void;
};

function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  function handleFieldChange(field: keyof LoginFormData, value: string) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await loginUser(formData);

      setAuthToken(response.token);
      setAuthUser(response.user);

      onLogin();
      navigate('/app');
    } catch {
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p className="auth-subtitle">Welcome back to Poker Dashboard</p>

        <label>
          Email
          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              handleFieldChange('email', event.target.value)
            }
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={formData.password}
            onChange={(event) =>
              handleFieldChange('password', event.target.value)
            }
          />
        </label>

        {errorMessage && <p className="auth-error">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-switch">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;