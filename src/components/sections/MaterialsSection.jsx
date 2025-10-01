import React from "react";
import { NavLink } from "react-router-dom";
import cue from "../../images/cue.jpg"

export default function MaterialsSection() {

    return (
        <section className="materials-section">
            <div className="materials-container">
                <div className="materials-image">
                    <img 
                        src={cue} 
                        alt="Premium Materials"
                        onError={(e) => {
                            // Fallback styling if image fails to load
                            e.target.style.backgroundColor = '#f0f0f0';
                            e.target.style.display = 'block';
                        }}
                    />
                </div>
                <div className="materials-content">
                    <h2 className="materials-title">
                        PREMIUM MATERIALS
                    </h2>
                    <p className="materials-subtitle">
                        Explore our carefully curated selection of exotic woods and semi-precious crystals, each chosen for their unique beauty and exceptional quality.
                    </p>
                    <NavLink to="/collections/materials" className="materials-button">
                        View Materials
                    </NavLink>
                </div>
            </div>
        </section>
    );
}