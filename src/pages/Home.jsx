import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Testimonials from '../components/Testimonials'
import { supabase } from '../lib/supabase'
import { DUMMY_PRODUCTS } from '../data'

const HERO_IMAGES = [
  "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=2000"
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNewProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_new', true)
          
        if (!error && data && data.length > 0) {
          setNewProducts(data)
        } else {
          setNewProducts(DUMMY_PRODUCTS.filter(p => p.isNew))
        }
      } catch {
        setNewProducts(DUMMY_PRODUCTS.filter(p => p.isNew))
      }
      setLoading(false)
    }
    fetchNewProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <section className="hero" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {HERO_IMAGES.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt="Hero" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center 15%',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 1
            }} 
          />
        ))}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', padding: '2rem', zIndex: 2 }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>THE NEW STANDARD</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px' }}>Elevate your everyday with our latest collection of meticulously crafted essentials.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/women" className="btn btn--primary" style={{ background: 'var(--color-white)', color: 'var(--color-black)', borderColor: 'var(--color-white)' }}>Shop Women</Link>
            <Link to="/men" className="btn" style={{ color: 'white', borderColor: 'white' }}>Shop Men</Link>
          </div>
        </div>
      </section>

      <section className="container animate-on-scroll" style={{ margin: '8rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2>New Arrivals</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/women" style={{ textDecoration: 'underline', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Women</Link>
            <Link to="/men" style={{ textDecoration: 'underline', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Men</Link>
          </div>
        </div>
        <div className="product-grid">
          {loading ? (
            <p>Loading products...</p>
          ) : newProducts.length > 0 ? (
            newProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <p>No new arrivals at the moment.</p>
          )}
        </div>
      </section>

      <Testimonials />
    </>
  )
}
