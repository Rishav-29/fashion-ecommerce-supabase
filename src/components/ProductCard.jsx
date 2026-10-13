import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star } from '@phosphor-icons/react'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)
  
  return (
    <div className="product-card" style={{ position: 'relative' }}>
      {product.is_new && (
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--color-black)', color: 'var(--color-white)', padding: '0.25rem 0.75rem', fontSize: '0.75rem', letterSpacing: '0.1em', zIndex: 2 }}>
          NEW
        </div>
      )}
      <div className="product-card__image">
        <Link to={`/product/${product.id}`}>
          <img src={product.image_url} alt={product.name} />
        </Link>
      </div>
      <div className="product-card__info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>{product.category}</span>
          <button 
            onClick={() => toggleWishlist(product.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isWishlisted ? 'var(--color-gold)' : 'var(--color-black)' }}
          >
            <Heart size={20} weight={isWishlisted ? "fill" : "regular"} />
          </button>
        </div>
        <Link to={`/product/${product.id}`} className="product-card__title">{product.name}</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.5rem', color: 'var(--color-gold)' }}>
          <Star size={14} weight="fill" />
          <Star size={14} weight="fill" />
          <Star size={14} weight="fill" />
          <Star size={14} weight="fill" />
          <Star size={14} weight="fill" />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginLeft: '0.25rem' }}>(124)</span>
        </div>
        <span className="product-card__price">${product.price.toFixed(2)}</span>
      </div>
    </div>
  )
}
