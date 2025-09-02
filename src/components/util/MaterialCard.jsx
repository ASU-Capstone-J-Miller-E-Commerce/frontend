import React, { useState } from "react";

export function MaterialCard({title, price, tag, material, image, images, onClick}) {
    const hasPrice = price !== undefined && price !== null && price !== "";
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Get image array from images prop, material, or use single image
    const imageArray = images || material?.imageUrls || (image ? [image] : []);
    const hasMultipleImages = imageArray.length > 1;
    
    const handleClick = () => {
        if (onClick && material?.guid) {
            onClick(material.guid);
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
        </div>
    );
}