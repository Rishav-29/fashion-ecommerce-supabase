import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { insforge } from '../lib/insforge'
import { DUMMY_PRODUCTS } from '../data'
import { Trash, Plus, Minus } from '@phosphor-icons/react'

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()

  const [populatedCart, setPopulatedCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCartProducts() {
      if (cartItems.length === 0) {
        setPopulatedCart([])
        setLoading(false)
        return
      }
      
      const productIds = [...new Set(cartItems.map(i => i.productId))]
      let sourceProducts = DUMMY_PRODUCTS
      
      try {
        const { data, error } = await insforge.database
          .from('products')
          .select('*')
          .in('id', productIds)
          
        if (!error && data && data.length > 0) {
          sourceProducts = data
        }
      } catch {}

      const mapped = cartItems.map(item => {
        const product = sourceProducts.find(p => p.id === item.productId) || DUMMY_PRODUCTS.find(p => p.id === item.productId)
        return { ...item, product }
      }).filter(item => item.product !== undefined)
      setPopulatedCart(mapped)
      setLoading(false)
    }
    fetchCartProducts()
  }, [cartItems])

  const subtotal = populatedCart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 0 ? 15 : 0 // fixed shipping mock
  const total = subtotal + shipping

  return (
    <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '6rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3rem', textAlign: 'center' }}>Your Cart</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>Loading cart...</p>
        </div>
      ) : populatedCart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>Your cart is currently empty.</p>
          <Link to="/" className="btn btn--primary">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          {/* Cart Items List */}
          <div style={{ flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-black)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>Product</span>
              <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>Total</span>
            </div>

            {populatedCart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '2rem' }}>
                <img src={item.product.image_url} alt={item.product.name} style={{ width: '120px', height: '160px', objectFit: 'cover' }} />
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.product.name}</h3>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Size: {item.size}</p>
                    <p style={{ fontWeight: 500 }}>${item.product.price.toFixed(2)}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-gray-300)' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={16} /></button>
                      <span style={{ width: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-500)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'uppercase' }}>Remove</button>
                  </div>
                </div>

                <div style={{ fontWeight: 500, fontSize: '1.1rem' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ flex: 1, background: 'var(--color-gray-100)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', borderBottom: '1px solid var(--color-gray-300)', paddingBottom: '1rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-gray-600)' }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ color: 'var(--color-gray-600)' }}>Estimated Shipping</span>
              <span style={{ fontWeight: 500 }}>${shipping.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--color-black)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <span style={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Total</span>
              <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn--primary" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '1.25rem', marginBottom: '1rem' }}>
              Proceed to Checkout
            </Link>
            
            <button onClick={clearCart} style={{ display: 'block', width: '100%', background: 'none', border: '1px solid var(--color-gray-300)', padding: '1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
