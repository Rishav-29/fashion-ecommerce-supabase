import React from 'react'
import { Link } from 'react-router-dom'

const ARTICLES = [
  {
    id: 1,
    title: 'The Art of Modern Tailoring',
    category: 'Design',
    image: 'https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg',
    excerpt: 'Exploring the meticulous process behind our signature suiting, where traditional craftsmanship meets contemporary silhouettes.'
  },
  {
    id: 2,
    title: 'Autumn/Winter 2026 Collection',
    category: 'Collections',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
    excerpt: 'A first look at the textures, tones, and inspirations defining the upcoming season.'
  },
  {
    id: 3,
    title: 'Sustainable Luxury: Our Promise',
    category: 'Sustainability',
    image: 'https://images.pexels.com/photos/35188/child-childrens-baby-children-s.jpg',
    excerpt: 'How we are reimagining the supply chain to ensure every garment leaves a positive impact on the world.'
  }
]

export default function Editorial() {
  return (
    <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '4rem', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Editorial</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '1rem', fontSize: '1.1rem' }}>Stories, collections, and insights from the world of LUMIÈRE.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {ARTICLES.map((article, index) => (
          <div key={article.id} className="animate-on-scroll" style={{ display: 'grid', gridTemplateColumns: index % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
              <img src={article.image} alt={article.title} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
            </div>
            <div style={{ order: index % 2 === 0 ? 2 : 1, padding: '2rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{article.category}</span>
              <h2 style={{ fontSize: '2.5rem', margin: '1rem 0', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>{article.title}</h2>
              <p style={{ color: 'var(--color-gray-600)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.8 }}>{article.excerpt}</p>
              <Link to="#" className="btn">Read Article</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
