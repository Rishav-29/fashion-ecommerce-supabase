import React from 'react'
import { Star } from '@phosphor-icons/react'

const REVIEWS = [
  {
    id: 1,
    author: 'Sarah Jenkins',
    text: '"The quality and attention to detail is unparalleled. I receive compliments every time I wear my LUMIÈRE pieces."',
  },
  {
    id: 2,
    author: 'David Chen',
    text: '"Finally, a brand that understands modern minimalism without sacrificing luxury. The fit is consistently perfect."',
  },
  {
    id: 3,
    author: 'Elena Rodriguez',
    text: '"From the packaging to the garment itself, every step of the LUMIÈRE experience feels incredibly premium."',
  },
  {
    id: 4,
    author: 'Marcus Thorne',
    text: '"Their evening wear collection is stunning. I felt absolutely confident at my last black-tie event."',
  }
]

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <h2>Client Experiences</h2>
        <div className="testimonial-grid">
          {REVIEWS.map(review => (
            <div key={review.id} className="testimonial-card animate-on-scroll">
              <div className="testimonial-stars">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={18} weight="fill" />
                ))}
              </div>
              <p className="testimonial-text">{review.text}</p>
              <span className="testimonial-author">{review.author}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
