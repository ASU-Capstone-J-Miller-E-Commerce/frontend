import React from "react";
import { NavLink } from "react-router-dom";

export function Card({title, image, price, tag, linkTo="#"}) {
    const hasPrice = price !== undefined && price !== null && price !== "";
    const hasTag = tag !== undefined && tag !== null && tag !== "";
    
    return (
        <NavLink to={linkTo} className="card-link">
            <div className="card-wrapper">
                {/* Card image */}
                <div className="card-image">
                    <img src={image}/>
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