import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export function Card({title, price, tag, linkTo="#", image, images, onClick, featured = false}) {
    const hasPrice = price !== undefined && price !== null && price !== "";
    const hasTag = tag !== undefined && tag !== null && tag !== "";
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Get image array from images prop or use single image
    const imageArray = images || (image ? [image] : []);
    const hasMultipleImages = imageArray.length > 1;
    
    const handleMouseEnter = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex(1);
        }
    };
    
    const handleMouseLeave = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex(0);
        }
    };
    
    return (
        <NavLink to={linkTo} className="card-link" onClick={onClick}>
            <div 
                className="card-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Card image */}
                <div className="card-image">
                    <img 
                        src={imageArray[currentImageIndex]} 
                        alt={title}
                    />
                    {/* Featured indicator overlay on image */}
                    {featured && (
                        <div className="card-featured-overlay">
                            <i className="fa-solid fa-star"></i>
                        </div>
                    )}
                </div>
                {/* Card Content */}
                <div className="card-content">
                    {/* Header  */}
                    <p className="card-title">
                       {hasPrice && `[${tag}]` } {title}
                    </p>
                    {/* Price */}
                    {hasPrice && (
                        <p className="card-price">
                            ${Number(price).toFixed(2)}
                        </p>
                    )}
                </div>
            </div>
        </NavLink>
    );
}

export function MaterialCard({ title, price, tag, material, image, images, onClick }) {
    const hasPrice = price !== undefined && price !== null && price !== "";
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Get image array from images prop, material, or use single image
    const imageArray = images || material?.imageUrls || (image ? [image] : []);
    const hasMultipleImages = imageArray.length > 1;

    const handleClick = () => {
        if (onClick && material) {
            onClick(material);
        }
    };
    
    const handleMouseEnter = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex(1);
        }
    };
    
    const handleMouseLeave = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex(0);
        }
    };

    return (
        <div 
            className="card-link" 
            onClick={handleClick} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-wrapper">
                {/* Card image */}
                <div className="card-image">
                    <img 
                        src={imageArray[currentImageIndex]} 
                        alt={title}
                    />
                </div>
                {/* Card Content */}
                <div className="card-content">
                    {/* Header  */}
                    <p className="card-title">
                        {hasPrice && `[${tag}]`} {title}
                    </p>
                </div>
            </div>
        </div>
    );
}
