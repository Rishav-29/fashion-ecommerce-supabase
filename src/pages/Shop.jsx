import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabase'
import { DUMMY_PRODUCTS } from '../data'
import { SlidersHorizontal, CaretDown, X } from '@phosphor-icons/react'

export default function Shop({ category }) {
  const location = useLocation()
  const [baseProducts, setBaseProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const prefix = category === 'Men' ? 'm' : 'w'
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .like('id', `${prefix}%`)
          
        if (!error && data && data.length > 0) {
          setBaseProducts(data)
        } else {
          setBaseProducts(DUMMY_PRODUCTS.filter(p => p.id.startsWith(prefix)))
        }
      } catch {
        setBaseProducts(DUMMY_PRODUCTS.filter(p => p.id.startsWith(prefix)))
      }
      setLoading(false)
    }
    fetchProducts()
  }, [category])
  
  // Extract unique subcategories from the products
  const availableCategories = useMemo(() => {
    const cats = baseProducts.map(p => p.category)
    return [...new Set(cats)]
  }, [baseProducts])

  const [sortOption, setSortOption] = useState('featured') // featured, price_asc, price_desc
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Close dropdowns on outside click
  const sortRef = useRef()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) setIsSortOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset filters when changing main category (Men -> Women)
  useEffect(() => {
    setSelectedSubcategory(null)
    setSortOption('featured')
    setIsFilterOpen(false)
    setIsSortOpen(false)
  }, [category, location.pathname])

  // Apply filters and sorting
  const processedProducts = useMemo(() => {
    let result = [...baseProducts]
    
    if (selectedSubcategory) {
      result = result.filter(p => p.category === selectedSubcategory)
    }
    
    if (sortOption === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    }
    
    return result
  }, [baseProducts, selectedSubcategory, sortOption])
  
  const sortLabel = sortOption === 'price_asc' ? 'Price: Low-High' : sortOption === 'price_desc' ? 'Price: High-Low' : 'Featured'

  return (
    <>
      <div className="container" style={{ margin: '0 auto', paddingTop: '10rem', paddingBottom: '6rem' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="animate-on-scroll" style={{ fontSize: '4rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {category}
          </h1>
          <p className="animate-on-scroll" style={{ fontSize: '1.2rem', color: 'var(--color-gray-500)', letterSpacing: '0.05em' }}>
            Discover the latest in {category.toLowerCase()}'s luxury.
          </p>
        </div>
        
        {/* Utility / Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '1.5rem', marginBottom: '3rem', position: 'relative', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', fontWeight: 500, color: isFilterOpen ? 'var(--color-gold)' : 'var(--color-black)' }}>
              <SlidersHorizontal size={18} /> {isFilterOpen ? 'Hide Filters' : 'Filters'}
            </button>
            <span style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>{processedProducts.length} Products</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }} ref={sortRef}>
            <span style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</span>
            <button onClick={() => setIsSortOpen(!isSortOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
              {sortLabel} <CaretDown size={14} />
            </button>
            
            {isSortOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '1rem', background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', zIndex: 10, minWidth: '200px', display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => { setSortOption('featured'); setIsSortOpen(false) }} style={{ padding: '1rem', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid var(--color-gray-200)', cursor: 'pointer', fontWeight: sortOption === 'featured' ? 600 : 400 }}>Featured</button>
                <button onClick={() => { setSortOption('price_asc'); setIsSortOpen(false) }} style={{ padding: '1rem', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid var(--color-gray-200)', cursor: 'pointer', fontWeight: sortOption === 'price_asc' ? 600 : 400 }}>Price: Low to High</button>
                <button onClick={() => { setSortOption('price_desc'); setIsSortOpen(false) }} style={{ padding: '1rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontWeight: sortOption === 'price_desc' ? 600 : 400 }}>Price: High to Low</button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="animate-on-scroll" style={{ marginBottom: '3rem', padding: '2rem', background: 'var(--color-gray-100)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginRight: '1rem' }}>Categories:</span>
            <button 
              onClick={() => setSelectedSubcategory(null)}
              style={{ padding: '0.5rem 1rem', border: `1px solid ${selectedSubcategory === null ? 'var(--color-black)' : 'var(--color-gray-300)'}`, background: selectedSubcategory === null ? 'var(--color-black)' : 'transparent', color: selectedSubcategory === null ? 'var(--color-white)' : 'var(--color-black)', cursor: 'pointer', fontSize: '0.85rem', borderRadius: '4px' }}
            >
              All
            </button>
            {availableCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedSubcategory(cat)}
                style={{ padding: '0.5rem 1rem', border: `1px solid ${selectedSubcategory === cat ? 'var(--color-black)' : 'var(--color-gray-300)'}`, background: selectedSubcategory === cat ? 'var(--color-black)' : 'transparent', color: selectedSubcategory === cat ? 'var(--color-white)' : 'var(--color-black)', cursor: 'pointer', fontSize: '0.85rem', borderRadius: '4px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--color-gray-600)' }}>Loading products...</p>
          </div>
        ) : processedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--color-gray-600)' }}>No products found matching your filters.</p>
            <button onClick={() => setSelectedSubcategory(null)} className="btn btn--primary" style={{ marginTop: '2rem' }}>Clear Filters</button>
          </div>
        ) : (
          <div className="product-grid">
            {processedProducts.map(p => (
              <div key={p.id} className="animate-on-scroll">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
        
        {/* Load More Mock */}
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <button className="btn" style={{ minWidth: '200px' }}>Load More</button>
        </div>
      </div>
    </>
  )
}
