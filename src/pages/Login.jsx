import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import Spinner from '../components/Spinner';

// Map Firebase Auth error codes to friendly messages
function getErrorMessage(code) {
  const messages = {
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
  };
  return messages[code] || 'Something went wrong. Please try again.';
}

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-mesh" />
      <div className="auth-layout">
        <div className="glass-card auth-card animate-scale">
          {/* Header */}
          <div className="auth-header">
            <span className="auth-logo">⚡</span>
            <h1 className="auth-title">FocusWar</h1>
            <p className="auth-subtitle">Welcome back. Ready to battle?</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="message message-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="divider">or</div>
          <p className="auth-footer">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}
