import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from '@phosphor-icons/react'
import { DUMMY_PRODUCTS } from '../data'

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase()
      const matches = DUMMY_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      )
      setResults(matches)
    } else {
      setResults([])
    }
  }, [query])

  if (!isOpen) return null

  return (
    <div className="search-modal" style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.98)', zIndex: 1000, overflowY: 'auto' }}>
      <button onClick={onClose} style={{ position: 'fixed', top: '2rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>
        <X size={32} />
      </button>
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
        <input 
          type="text" 
          placeholder="Search for products..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', fontSize: '2.5rem', padding: '1rem 0', border: 'none', borderBottom: '2px solid var(--color-black)', outline: 'none', background: 'transparent', fontFamily: 'var(--font-serif)' }} 
          autoFocus
        />
        
        <div style={{ marginTop: '3rem' }}>
          {query.trim().length > 0 && results.length === 0 && (
            <p style={{ color: 'var(--color-gray-500)', fontSize: '1.2rem' }}>No results found for "{query}".</p>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {results.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', borderBottom: '1px solid var(--color-gray-200)', transition: 'background 0.3s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-gray-100)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <img src={product.image} alt={product.name} style={{ width: '80px', height: '100px', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{product.name}</h3>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{product.category}</p>
                  <p style={{ fontWeight: 500 }}>${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
