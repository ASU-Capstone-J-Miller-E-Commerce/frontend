import React from "react";

export default function TestimonialsSection () {
    const testimonials = [
        {
            id: 1,
            name: "Michael Thompson",
            rating: 5,
            text: "Absolutely love my new cue! The craftsmanship is incredible and you can really feel the quality in every shot. It's completely transformed my game."
        },
        {
            id: 2,
            name: "Sarah Chen",
            rating: 5,
            text: "From the beautiful wood grain to the perfect weight distribution, this cue exceeded all my expectations."
        }
    ];

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <i 
                key={index} 
                className={`fa-solid fa-star ${index < rating ? 'star-filled' : 'star-empty'}`}
            />
        ));
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <h2 className="testimonials-title">TESTIMONIALS</h2>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="testimonial-card">
                            <div className="testimonial-stars">
                                {renderStars(testimonial.rating)}
                            </div>
                            <h3 className="testimonial-name">{testimonial.name}</h3>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}