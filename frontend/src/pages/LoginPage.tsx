import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  function handleFieldChange(field: keyof LoginFormData, value: string) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(formData);
    onLogin();
    navigate('/app');
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

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

        <button type="submit">Login</button>

        <p className="auth-switch">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;