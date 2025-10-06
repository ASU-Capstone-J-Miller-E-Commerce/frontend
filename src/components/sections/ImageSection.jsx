import React from "react";
import img from "../../images/featured.jpg";

export default function ImageSection () {

    return (
        <section className="image-section">
            <img   
                src={img} 
                alt="Welcome To J.Miller Cues" 
                onError={(e) => {
                    // Fallback styling if image fails to load
                    e.target.style.backgroundColor = '#f0f0f0';
                    e.target.style.display = 'block';
                }}
            />
        </section>
    );
}