import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ArrowLeft, ShoppingBag, Check } from '@phosphor-icons/react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { insforge } from '../lib/insforge'
import { DUMMY_PRODUCTS } from '../data'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(null)
  const [isAdded, setIsAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState(null)

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section)
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await insforge.database
          .from('products')
          .select('*')
          .eq('id', id)
          .single()
        
        if (!error && data) {
          setProduct(data)
        } else {
          setProduct(DUMMY_PRODUCTS.find(p => p.id === id) || null)
        }
      } catch {
        setProduct(DUMMY_PRODUCTS.find(p => p.id === id) || null)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])
  
  if (loading) {
    return (
      <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/" style={{ textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>Return Home</Link>
      </div>
    )
  }

  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addToCart(product.id, selectedSize)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '6rem', minHeight: '80vh' }}>
      <Link to={`/${product.id.startsWith('m') ? 'men' : 'women'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--color-gray-500)' }}>
        <ArrowLeft size={16} /> Back to Collection
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        {/* Left: Image */}
        <div style={{ background: 'var(--color-gray-100)', position: 'relative' }}>
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
        </div>

        {/* Right: Details */}
        <div className="animate-on-scroll">
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', margin: '1rem 0', lineHeight: 1.2 }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '2rem' }}>
            ${product.price.toFixed(2)}
          </p>

          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            {product.description}
          </p>

          {/* Sizes */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', fontWeight: 500 }}>Select Size</span>
              <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--color-gray-500)', cursor: 'pointer', fontSize: '0.85rem' }}>Size Guide</button>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => {
                    setSelectedSize(size)
                    setSizeError(false)
                  }}
                  style={{ 
                    width: '3rem', 
                    height: '3rem', 
                    border: `1px solid ${selectedSize === size ? 'var(--color-black)' : 'var(--color-gray-300)'}`, 
                    background: selectedSize === size ? 'var(--color-black)' : 'transparent',
                    color: selectedSize === size ? 'var(--color-white)' : 'var(--color-black)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.85rem' }}>Please select a size before adding to cart.</p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleAddToCart}
              className="btn btn--primary" 
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1.25rem', transition: 'all 0.3s', background: isAdded ? 'var(--color-gold)' : 'var(--color-black)', borderColor: isAdded ? 'var(--color-gold)' : 'var(--color-black)' }}
            >
              {isAdded ? (
                <>
                  <Check size={20} /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={20} /> Add to Cart
                </>
              )}
            </button>
            <button 
              onClick={() => toggleWishlist(product.id)}
              style={{ 
                width: '3.5rem', 
                border: '1px solid var(--color-gray-300)', 
                background: 'transparent', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                cursor: 'pointer',
                color: isWishlisted ? 'var(--color-gold)' : 'var(--color-black)',
                transition: 'all 0.3s'
              }}
            >
              <Heart size={24} weight={isWishlisted ? "fill" : "regular"} />
            </button>
          </div>

          {/* Accordion / Extra info */}
          <div style={{ marginTop: '4rem', borderTop: '1px solid var(--color-gray-200)' }}>
            <div onClick={() => toggleAccordion('shipping')} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-gray-200)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', fontWeight: 500 }}>Shipping & Returns</span>
                <span style={{ transform: activeAccordion === 'shipping' ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', fontSize: '1.2rem' }}>+</span>
              </div>
              {activeAccordion === 'shipping' && (
                <div style={{ marginTop: '1rem', color: 'var(--color-gray-600)', fontSize: '0.9rem', lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Shipping:</strong> Free standard shipping on all orders over $150. Delivery typically takes 3-5 business days. Expedited shipping is available at checkout.</p>
                  <p><strong>Returns:</strong> We gladly accept returns within 30 days of purchase for a full refund. Items must be in original, unworn condition with all tags attached.</p>
                </div>
              )}
            </div>

            <div onClick={() => toggleAccordion('materials')} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-gray-200)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', fontWeight: 500 }}>Materials & Care</span>
                <span style={{ transform: activeAccordion === 'materials' ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', fontSize: '1.2rem' }}>+</span>
              </div>
              {activeAccordion === 'materials' && (
                <div style={{ marginTop: '1rem', color: 'var(--color-gray-600)', fontSize: '0.9rem', lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                  <p style={{ marginBottom: '0.5rem' }}><strong>Materials:</strong> Crafted from premium, sustainably sourced fabrics carefully selected for comfort, breathability, and durability.</p>
                  <p><strong>Care:</strong> Machine wash cold with like colors. Tumble dry on low or lay flat to dry to preserve the fabric's integrity. Do not bleach. Iron on low heat if needed.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
