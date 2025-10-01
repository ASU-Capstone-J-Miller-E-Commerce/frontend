import React from "react";
import { NavLink } from "react-router-dom";
import cue from "../../images/cue.jpg"

export default function ShopNowSection () {

    return (
        <section className="shop-now-section">
            <div className="shop-now-container">
                <div className="shop-now-image">
                    <img 
                        src={cue} 
                        alt="Hand Craftmanship"
                        onError={(e) => {
                            // Fallback styling if image fails to load
                            e.target.style.backgroundColor = '#f0f0f0';
                            e.target.style.display = 'block';
                        }}
                    />
                </div>
                <div className="shop-now-content">
                    <h2 className="shop-now-title">
                        HAND CRAFTMANSHIP
                    </h2>
                    <p className="shop-now-subtitle">
                        Hand-crafted pool cues proudly Made in America. Virtually every piece of each cue is carefully crafted in-house to ensure the highest standards.
                    </p>
                    <NavLink to="/collections/cues" className="shop-now-button">
                        Shop Now
                    </NavLink>
                </div>
            </div>
        </section>
    );
}