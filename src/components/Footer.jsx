import React from 'react'
import { Link } from 'react-router-dom'
import { InstagramLogo, TiktokLogo, PinterestLogo } from '@phosphor-icons/react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="nav__brand">Lumière</Link>
            <p style={{ color: 'var(--color-gray-400)', fontSize: '0.9rem', marginTop: '1.5rem', maxWidth: '250px' }}>
              Redefining modern luxury with minimalist design and uncompromising quality.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="footer-col__title">Shop</h4>
            <div className="footer-col__links">
              <Link to="/men" className="footer-col__link">Men</Link>
              <Link to="/women" className="footer-col__link">Women</Link>
              <Link to="#" className="footer-col__link">New Arrivals</Link>
            </div>
          </div>
          <div className="footer-col">
            <h4 className="footer-col__title">Brand</h4>
            <div className="footer-col__links">
              <Link to="/about" className="footer-col__link">About Us</Link>
              <Link to="/editorial" className="footer-col__link">Editorial</Link>
              <Link to="#" className="footer-col__link">Contact</Link>
            </div>
          </div>
          <div className="footer-col">
            <h4 className="footer-col__title">Newsletter</h4>
            <p style={{ color: 'var(--color-gray-400)', fontSize: '0.85rem' }}>Subscribe for updates.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }} style={{ display: 'flex', borderBottom: '1px solid var(--color-black)', marginTop: '1rem' }}>
              <input type="email" placeholder="Email Address" required style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0.5rem 0', flex: 1 }} />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>Join</button>
            </form>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-gray-200)' }}>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>&copy; 2026 LUMIÈRE. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-gray-500)' }}>
            <InstagramLogo size={24} />
            <TiktokLogo size={24} />
            <PinterestLogo size={24} />
          </div>
        </div>
      </div>
    </footer>
  )
}
