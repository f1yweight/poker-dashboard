import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

type RegisterPageProps = {
  onRegister: () => void;
};

function RegisterPage({ onRegister }: RegisterPageProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  function handleFieldChange(field: keyof RegisterFormData, value: string) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(formData);
    onRegister();
    navigate('/app');
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

        <button type="submit">Create account</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;