import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { insforge } from '../lib/insforge'
import { DUMMY_PRODUCTS } from '../data'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { wishlist } = useWishlist()
  const [savedProducts, setSavedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlist.length === 0) {
        setSavedProducts([])
        setLoading(false)
        return
      }

      try {
        const { data, error } = await insforge.database
          .from('products')
          .select('*')
          .in('id', wishlist)

        if (!error && data && data.length > 0) {
          setSavedProducts(data)
        } else {
          setSavedProducts(DUMMY_PRODUCTS.filter(p => wishlist.includes(p.id)))
        }
      } catch {
        setSavedProducts(DUMMY_PRODUCTS.filter(p => wishlist.includes(p.id)))
      }
      setLoading(false)
    }
    fetchWishlistProducts()
  }, [wishlist])

  return (
    <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '3rem', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Wishlist</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '1rem' }}>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--color-gray-600)' }}>Loading your wishlist...</p>
        </div>
      ) : savedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ marginBottom: '2rem', color: 'var(--color-gray-600)' }}>Your wishlist is currently empty.</p>
          <Link to="/" className="btn btn--primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="product-grid">
          {savedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
