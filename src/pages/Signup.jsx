import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [otp, setOtp] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      const data = await signUp(email, password, fullName);
      if (data?.access_token) {
        navigate('/account');
      } else {
        setNeedsVerification(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await verifyEmail(email, otp);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className="container" style={{ maxWidth: '400px', margin: '8rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Verify Email</h1>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
          We sent a 6-digit verification code to <strong>{email}</strong>.
        </p>
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Code</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              placeholder="123456"
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-gray-300)', background: 'transparent', textAlign: 'center', letterSpacing: '0.25em', fontSize: '1.25rem' }} 
            />
          </div>
          <button disabled={loading} type="submit" className="btn btn--primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
            {loading ? 'Verifying...' : 'Verify & Log In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '8rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Create Account</h1>
      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
      
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleSignUp}
        className="btn"
        style={{
          width: '100%',
          padding: '0.9rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          border: '1px solid var(--color-gray-300)',
          background: 'var(--color-white)',
          color: 'var(--color-black)',
          cursor: 'pointer'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--color-gray-500)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-gray-200)' }} />
        <span style={{ padding: '0 1rem' }}>or sign up with email</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-gray-200)' }} />
      </div>

      <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-gray-300)', background: 'transparent' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-gray-300)', background: 'transparent' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-gray-300)', background: 'transparent' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm Password</label>
          <input 
            type="password" 
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-gray-300)', background: 'transparent' }} 
          />
        </div>
        <button disabled={loading} type="submit" className="btn btn--primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ textDecoration: 'underline' }}>Log In</Link>
      </div>
    </div>
  );
}
