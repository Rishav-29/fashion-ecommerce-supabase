import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { DUMMY_PRODUCTS } from '../data'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, UploadSimple } from '@phosphor-icons/react'

export default function Checkout() {
  const { cartItems, clearCart } = useCart()
  const { user } = useAuth()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(true)
  const [populatedCart, setPopulatedCart] = useState([])
  const [receiptFile, setReceiptFile] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

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
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
          
        if (!err && data && data.length > 0) {
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
  const shipping = subtotal > 0 ? 15 : 0
  const total = subtotal + shipping

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to place an order.')
      return
    }
    if (paymentMethod === 'bank_transfer' && !receiptFile) {
      setError('Please upload a payment receipt.')
      return
    }
    
    setSubmitting(true)
    setError(null)
    
    try {
      let receiptUrl = 'COD'
      
      if (paymentMethod === 'bank_transfer') {
        const fileExt = receiptFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('payment-uploads')
          .upload(fileName, receiptFile)
          
        if (uploadError) throw uploadError
        
        receiptUrl = `${supabase.storage.from('payment-uploads').getPublicUrl(fileName).data.publicUrl}`
      }

      // 2. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'processing',
          payment_receipt_url: receiptUrl,
          shipping_address: '123 Checkout St' // Simplified for MVP
        })
        .select()
        .single()
        
      if (orderError) throw orderError

      // 3. Create Order Items
      const orderItemsToInsert = populatedCart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        size: item.size,
        quantity: item.quantity,
        price_at_purchase: item.product.price
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)
        
      if (itemsError) throw itemsError

      clearCart()
      setOrderPlaced(true)
    } catch (err) {
      console.error(err)
      setError('Failed to place order: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="container" style={{ margin: '0 auto', paddingTop: '10rem', paddingBottom: '6rem', textAlign: 'center', minHeight: '80vh' }}>
        <CheckCircle size={80} color="var(--color-gold)" style={{ marginBottom: '2rem' }} weight="fill" />
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Order Confirmed</h1>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '1.2rem', marginBottom: '3rem' }}>Thank you for your purchase. You will receive an email confirmation shortly.</p>
        <Link to="/" className="btn btn--primary">Return to Store</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container" style={{ margin: '0 auto', paddingTop: '10rem', paddingBottom: '6rem', textAlign: 'center', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Checkout</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>Loading checkout...</p>
      </div>
    )
  }

  // If cart is empty and order not placed yet, just show a message
  if (populatedCart.length === 0) {
    return (
      <div className="container" style={{ margin: '0 auto', paddingTop: '10rem', paddingBottom: '6rem', textAlign: 'center', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Checkout</h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>Your cart is empty.</p>
        <Link to="/" className="btn btn--primary">Return to Store</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '6rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3rem' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left: Forms */}
        <div style={{ flex: 2 }}>
          <form id="checkout-form" onSubmit={handlePlaceOrder}>
            {/* Contact Info */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-300)', paddingBottom: '1rem' }}>Contact Information</h2>
              <div style={{ marginBottom: '1rem' }}>
                <input type="email" required placeholder="Email Address" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-gray-300)', outline: 'none' }} />
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-300)', paddingBottom: '1rem' }}>Shipping Address</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" required placeholder="First Name" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-gray-300)', outline: 'none' }} />
                <input type="text" required placeholder="Last Name" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-gray-300)', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" required placeholder="Address" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-gray-300)', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" placeholder="Apartment, suite, etc. (optional)" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-gray-300)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" required placeholder="City" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-gray-300)', outline: 'none' }} />
                <input type="text" required placeholder="Postal Code" style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-gray-300)', outline: 'none' }} />
              </div>
            </div>

            {/* Payment Details */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-300)', paddingBottom: '1rem' }}>Payment</h2>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Bank Transfer
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>
              </div>

              {paymentMethod === 'bank_transfer' && (
                <>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>Please upload your bank transfer or payment receipt.</p>
                  
                  <div style={{ border: '2px dashed var(--color-gray-300)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--color-gray-100)' }} onClick={() => document.getElementById('receipt-upload').click()}>
                    <UploadSimple size={32} color="var(--color-gray-500)" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>
                      {receiptFile ? receiptFile.name : 'Click to upload receipt'}
                    </div>
                    <input 
                      type="file" 
                      id="receipt-upload" 
                      style={{ display: 'none' }} 
                      accept="image/*,.pdf"
                      onChange={(e) => setReceiptFile(e.target.files[0])}
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'cod' && (
                <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#047857', padding: '1.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle size={24} weight="fill" />
                  <p style={{ fontWeight: 500 }}>Payment will be collected automatically on delivery.</p>
                </div>
              )}
            </div>
            
            {error && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', marginBottom: '2rem' }}>
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Right: Order Summary */}
        <div style={{ flex: 1, background: 'var(--color-gray-100)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', borderBottom: '1px solid var(--color-gray-300)', paddingBottom: '1rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-gray-300)', paddingBottom: '2rem' }}>
            {populatedCart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem' }}>
                <img src={item.product.image_url} alt={item.product.name} style={{ width: '60px', height: '80px', objectFit: 'cover' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '0.25rem' }}>{item.product.name}</h4>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>Size: {item.size} | Qty: {item.quantity}</p>
                </div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', alignSelf: 'center' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-gray-600)' }}>Subtotal</span>
            <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <span style={{ color: 'var(--color-gray-600)' }}>Shipping</span>
            <span style={{ fontWeight: 500 }}>${shipping.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--color-black)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <span style={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Total</span>
            <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>${total.toFixed(2)}</span>
          </div>

          <button disabled={submitting} type="submit" form="checkout-form" className="btn btn--primary" style={{ display: 'block', width: '100%', padding: '1.25rem' }}>
            {submitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>

      </div>
    </div>
  )
}
