import React from "react";

export function MaterialCard({title, image, price, tag, material}) {
    const hasPrice = price !== undefined && price !== null && price !== "";
    
    const handleClick = () => {
        if (window.openMaterialDialog && material) {
            window.openMaterialDialog(material);
        }
    };
    
    return (
        <div className="card-link" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className="card-wrapper">
                {/* Card image */}
                <div className="card-image">
                    <img src={image} alt={title} />
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