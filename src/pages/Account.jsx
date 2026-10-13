import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { insforge } from '../lib/insforge'
import { SignOut } from '@phosphor-icons/react'

export default function Account() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      const { data, error } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!error && data) {
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) return <div className="container" style={{ margin: '8rem auto', textAlign: 'center' }}>Loading...</div>

  return (
    <div className="container animate-on-scroll" style={{ margin: '8rem auto', maxWidth: '800px', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
        <h1 style={{ fontSize: '2.5rem' }}>My Account</h1>
        <button onClick={handleSignOut} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SignOut size={20} /> Sign Out
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profile Information</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Email</div>
            <div>{user?.email}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Full Name</div>
            <div>{profile?.full_name || 'Not provided'}</div>
          </div>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/orders" className="btn btn--primary" style={{ textAlign: 'center' }}>View Order History</Link>
            <Link to="/wishlist" className="btn" style={{ textAlign: 'center' }}>View Wishlist</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
