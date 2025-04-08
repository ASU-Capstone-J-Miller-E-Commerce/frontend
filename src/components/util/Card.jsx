import React from "react";

export function Card({title, image, price=""}) {
    return (
        <div className="card-wrapper">
            {/* Card image */}
            <div className="card-image">
                <img src={image}/>
            </div>
            {/* Card Content */}
            <div className="card-content">
                {/* Header  */}
                <h3>
                    {title}
                </h3>
                {/* Price */}
                <span>
                    ${Number(price).toFixed(2)}
                </span>
            </div>
        </div>
    );
}