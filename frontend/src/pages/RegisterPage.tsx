import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../features/auth/authApi';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  function handleFieldChange(field: keyof RegisterFormData, value: string) {
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
      await registerUser(formData);
      navigate('/login');
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Register</h1>

        <label>
          Username
          <input
            type="text"
            value={formData.username}
            onChange={(event) =>
              handleFieldChange('username', event.target.value)
            }
          />
        </label>

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
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;