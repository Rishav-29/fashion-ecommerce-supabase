import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MagnifyingGlass, Heart, User, ShoppingBag, List, X } from '@phosphor-icons/react'
import SearchModal from './SearchModal'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { wishlist } = useWishlist()
  const { getCartCount } = useCart()
  const { user } = useAuth()
  
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Counters
  const cartCount = getCartCount()
  const wishlistCount = wishlist.length

  const headerClass = `header ${!isHomePage || isScrolled ? 'scrolled' : ''}`

  return (
    <>
      <header className={headerClass}>
        <div className="container nav">
          <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <List size={24} color="inherit" />
          </div>
          
          <Link to="/" className="nav__brand">Lumière</Link>
          
          <ul className="nav__menu" style={{ display: 'flex' }}>
            <li><Link to="/men" className="nav__link">Men</Link></li>
            <li><Link to="/women" className="nav__link">Women</Link></li>
            <li><Link to="/editorial" className="nav__link">Editorial</Link></li>
            <li><Link to="/about" className="nav__link">About</Link></li>
          </ul>
          
          <div className="nav__icons">
            <button className="nav__icon" onClick={() => setIsSearchOpen(true)} style={{background:'none',border:'none',cursor:'pointer', color: 'inherit'}}>
              <MagnifyingGlass size={24} />
            </button>
            <Link to="/wishlist" className="nav__icon">
              <Heart size={24} color="inherit" />
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </Link>
            <Link to={user ? "/account" : "/login"} className="nav__icon user-icon">
              <User size={24} color="inherit" />
            </Link>
            <Link to="/cart" className="nav__icon">
              <ShoppingBag size={24} color="inherit" />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" style={{ display: 'flex', flexDirection: 'column', position: 'fixed', top: '80px', left: 0, width: '100%', background: 'white', zIndex: 99, padding: '2rem' }}>
          <Link to="/men" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
          <Link to="/women" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
          <Link to="/editorial" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>Editorial</Link>
          <Link to="/about" className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to={user ? "/account" : "/login"} className="mobile-menu__link" onClick={() => setIsMobileMenuOpen(false)}>{user ? "Account" : "Login"}</Link>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
