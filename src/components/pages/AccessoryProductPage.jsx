import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";
import { getAccessoryByGuid } from "../../util/requests";
import NotFoundPage from "./NotFoundPage";

export default function AccessoryProductPage() {
    const { guid } = useParams();
    const navigate = useNavigate();
    const [accessory, setAccessory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (guid) {
            setLoading(true);
            getAccessoryByGuid(guid)
                .then(response => {
                    if (response && response.data) {
                        setAccessory(response.data);
                    } else {
                        setError("Accessory not found");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError("Failed to load accessory");
                    setLoading(false);
                    console.error("Error fetching accessory:", err);
                })
        }
    }, [guid]);

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const handlePurchase = () => {
        // TODO: Implement purchase functionality
        console.log("Purchase accessory:", accessory);
    };

    if (loading) {
        return (
            <div className="product-page">
                <div className="product-container">
                    <div className="product-loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (error || !accessory) {
        return <NotFoundPage />
    }

    const images = accessory.imageUrls || [];
    const hasImages = images.length > 0;
    const hasPrice = accessory.price !== undefined && accessory.price !== null && accessory.price !== "";
    const isAvailable = accessory.status === "Available";

    return (
        <div className="product-page">
            <div className="product-container">
                {/* Image Gallery */}
                <div className="product-gallery">
                    {hasImages ? (
                        <>
                            <div className="product-main-image">
                                <img 
                                    src={images[currentImageIndex]} 
                                    alt={accessory.name}
                                    className="main-image"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="product-thumbnails">
                                    {images.map((image, index) => (
                                        <div 
                                            key={index}
                                            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                            onClick={() => handleImageChange(index)}
                                        >
                                            <img src={image} alt={`${accessory.name} view ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="product-no-image">
                            <div className="no-image-placeholder">
                                <i className="fa-solid fa-image"></i>
                                <span>No Image Available</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <div className="product-header">
                        <div className="product-title-section">
                            <span className="product-number">[{accessory.accessoryNumber}]</span>
                            <h1 className="product-title">{accessory.name}</h1>
                        </div>
                        {hasPrice && (
                            <div className="product-price">
                                ${Number(accessory.price).toFixed(2)}
                            </div>
                        )}
                        <div className={`product-status ${accessory.status}`}>
                            {accessory.status.charAt(0).toUpperCase() + accessory.status.slice(1)}
                        </div>
                    </div>

                    {accessory.description && (
                        <div className="product-description">
                            <p>{accessory.description}</p>
                        </div>
                    )}

                    {/* Purchase Section */}
                    <div className="product-purchase">
                        {isAvailable && hasPrice ? (
                            <DefaultButton
                                text="Add to Cart"
                                onClick={handlePurchase}
                                className="full-width-btn"
                            />
                        ) : isAvailable ? (
                            <DefaultButton 
                                text="Contact for Pricing" 
                                onClick={() => navigate("/contact")} 
                            />
                        ) : (
                            <div className="unavailable-notice">
                                This accessory is currently {accessory.status}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
