import React from "react";
import { useNavigate } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";
import cue from "../../images/wipcues.jpg"

export default function ShopNowSection () {
    const navigate = useNavigate();

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
                    <DefaultButton 
                        text="Shop Now" 
                        onClick={() => navigate('/collections/cues')}
                        className="shop-now-button-custom"
                    />
                </div>
            </div>
        </section>
    );
}