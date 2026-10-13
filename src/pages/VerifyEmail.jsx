import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await verifyEmail(email, otp);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Failed to verify email code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '8rem auto', padding: '0 1rem', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Verify Email</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-gray-600)' }}>
        We sent a 6-digit verification code to your email. Please enter it below to confirm your account.
      </p>
      
      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={!!emailParam}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-gray-300)', background: 'transparent' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Code (OTP)</label>
          <input 
            type="text" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            placeholder="123456"
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-gray-300)', background: 'transparent', letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2rem' }} 
          />
        </div>
        
        <button disabled={loading} type="submit" className="btn btn--primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
}
