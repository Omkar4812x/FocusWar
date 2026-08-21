import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Spinner from '../components/Spinner';

function getErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password sign-up is not enabled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return messages[code] || 'Something went wrong. Please try again.';
}

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password } = form;

    if (!name.trim() || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Write user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.toLowerCase(),
        xp: 0,
        level: 1,
        streak: 0,
        lastStudyDate: null,
        createdAt: serverTimestamp(),
      });

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
            <h1 className="auth-title">Join FocusWar</h1>
            <p className="auth-subtitle">Start your focus journey today</p>
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
              <label className="input-label" htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                className="input"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
                autoFocus
                maxLength={50}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? <><Spinner /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="divider">or</div>
          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
