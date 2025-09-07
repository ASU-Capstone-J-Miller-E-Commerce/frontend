import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DefaultButton } from "../util/Buttons";
import { getAccessoryByGuid, addToCart } from "../../util/requests";
import { addCartItemRedux } from "../../util/redux/actionCreators";
import { receiveErrors, receiveLogs, receiveResponse } from "../../util/notifications";
import NotFoundPage from "./NotFoundPage";

export default function AccessoryProductPage() {
    const { guid } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => !!state.user?.authenticated);
    const [accessory, setAccessory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

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

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            receiveErrors("Please log in to add items to your cart");
            navigate("/login");
            return;
        }

        setAddingToCart(true);
        
        // Add to cart on backend first
        addToCart(accessory.guid, 'accessory', quantity)
            .then((res) => {
                receiveResponse(res);
                
                // Update Redux with the new cart item after successful backend operation
                const cartItem = {
                    itemGuid: accessory.guid,
                    itemType: 'accessory',
                    quantity: quantity,
                    addedAt: new Date().toISOString(), // Use ISO string for serialization
                    itemDetails: accessory
                };
                
                addCartItemRedux(cartItem);
                setAddingToCart(false);
            })
            .catch((error) => {
                setAddingToCart(false);
            });
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
                            <>
                                <div className="quantity-section">
                                    <div className="quantity-controls">
                                        <label htmlFor="quantity">Quantity:</label>
                                        <div className="quantity-input-wrapper">
                                            <button 
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="quantity-btn"
                                            >
                                                -
                                            </button>
                                            <input 
                                                id="quantity"
                                                type="number" 
                                                min="1" 
                                                max="5"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const value = Math.min(5, Math.max(1, parseInt(e.target.value) || 1));
                                                    setQuantity(value);
                                                }}
                                                className="quantity-input"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setQuantity(Math.min(5, quantity + 1))}
                                                disabled={quantity >= 5}
                                                className="quantity-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="quantity-disclaimer">
                                        <small>* Maximum quantity of 5 per item</small>
                                    </div>
                                </div>
                                <DefaultButton
                                    text={addingToCart ? "Adding..." : "Add to Cart"}
                                    onClick={handlePurchase}
                                    disabled={addingToCart}
                                    className="full-width-btn"
                                />
                            </>
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
