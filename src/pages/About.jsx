import React from 'react'

export default function About() {
  return (
    <div className="container" style={{ margin: '0 auto', paddingTop: '8rem', paddingBottom: '4rem', minHeight: '60vh', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>About Lumière</h1>
        <p style={{ color: 'var(--color-gray-500)', marginTop: '1rem', fontSize: '1.1rem' }}>Redefining the essence of modern luxury.</p>
      </div>

      <div className="animate-on-scroll">
        <img 
          src="https://images.pexels.com/photos/31768082/pexels-photo-31768082.jpeg" 
          alt="Brand Heritage" 
          style={{ width: '100%', height: '400px', objectFit: 'cover', marginBottom: '3rem' }} 
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '1.1rem', color: 'var(--color-gray-600)', lineHeight: 1.8 }}>
          <p>
            Founded on the principles of minimalism, exceptional craftsmanship, and timeless elegance, LUMIÈRE exists to elevate the everyday wardrobe. We believe that true luxury lies not in excess, but in the perfect balance of form, function, and feeling.
          </p>
          <p>
            Our garments are meticulously designed in our studio, sourcing only the finest sustainable materials from around the globe. Every piece is a testament to our dedication to quality, ensuring that it not only looks beautiful but endures through seasons and trends.
          </p>
          <p>
            We invite you to experience the understated sophistication that defines LUMIÈRE.
          </p>
        </div>
      </div>
    </div>
  )
}
