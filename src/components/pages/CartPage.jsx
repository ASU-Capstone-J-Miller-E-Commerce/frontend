import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DefaultButton } from "../util/Buttons";
import { updateCartItem, removeFromCart, clearCart } from "../../util/requests";
import { receiveResponse } from "../../util/notifications";
import { setCartItems, updateCartItemRedux, removeCartItemRedux, clearCartRedux } from "../../util/redux/actionCreators";

export default function CartPage() {
    const navigate = useNavigate();
    
    // Get cart data from Redux
    const cartItems = useSelector(state => state.cart.items);
    const totalItems = useSelector(state => state.cart.totalItems);

    // Remove the useEffect and loadCart since we're using Redux
    // The cart should already be loaded in Redux from the authentication flow

    const handleUpdateQuantity = async (itemGuid, newQuantity) => {
        if (newQuantity < 1) return;
        
        updateCartItem(itemGuid, newQuantity)
            .then((response) => {
                receiveResponse(response);
                // Update Redux state
                updateCartItemRedux(itemGuid, newQuantity);
            })
            .catch(() => {
                // Errors are already handled by the request system
            });
    };

    const handleRemoveItem = async (itemGuid) => {
        removeFromCart(itemGuid)
            .then((response) => {
                receiveResponse(response);
                // Update Redux state
                removeCartItemRedux(itemGuid);
            })
            .catch(() => {
                // Errors are already handled by the request system
            });
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your entire cart?")) {
            return;
        }

        clearCart()
            .then((response) => {
                receiveResponse(response);
                // Update Redux state
                clearCartRedux();
            })
            .catch(() => {
                // Errors are already handled by the request system
            });
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.itemDetails?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const hasItemsWithoutPrice = () => {
        return cartItems.some(item => !item.itemDetails?.price);
    };

    // No loading state needed since we're using Redux
    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="cart-empty">
                        <h1>Your Cart</h1>
                        <div className="empty-cart-content">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <h2>Your cart is empty</h2>
                            <p>Add some cues or accessories to get started!</p>
                            <DefaultButton 
                                text="Shop Cues" 
                                onClick={() => navigate("/collections/cues")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const total = calculateTotal();

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Your Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})</h1>
                    {cartItems.length > 0 && (
                        <button 
                            className="clear-cart-btn"
                            onClick={handleClearCart}
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.itemGuid}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="summary-content">
                            <h3>Order Summary</h3>
                            
                            <div className="summary-line">
                                <span>Items ({totalItems}):</span>
                                <span>{hasItemsWithoutPrice() ? "Contact for pricing" : `$${total.toFixed(2)}`}</span>
                            </div>
                            
                            <div className="summary-line total">
                                <span>Total:</span>
                                <span>{hasItemsWithoutPrice() ? "Contact for pricing" : `$${total.toFixed(2)}`}</span>
                            </div>

                            {hasItemsWithoutPrice() ? (
                                <DefaultButton 
                                    text="Contact for Pricing" 
                                    onClick={() => navigate("/pages/contact-us")}
                                    className="full-width-btn"
                                />
                            ) : (
                                <DefaultButton 
                                    text="Proceed to Checkout" 
                                    onClick={() => navigate("/checkout")}
                                    className="full-width-btn"
                                />
                            )}
                            
                            <button 
                                className="continue-shopping-btn"
                                onClick={() => navigate("/collections/cues")}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CartItem({ item, onUpdateQuantity, onRemove }) {
    const { itemDetails, quantity, itemGuid, itemType } = item;
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!itemDetails) {
        return null; // Item no longer exists
    }

    const itemUrl = itemType === 'cue' 
        ? `/cues/${itemDetails.guid}` 
        : `/accessories/${itemDetails.guid}`;

    const itemNumber = itemType === 'cue' 
        ? itemDetails.cueNumber 
        : itemDetails.accessoryNumber;

    const hasPrice = itemDetails.price !== undefined && itemDetails.price !== null && itemDetails.price !== "";
    const isAvailable = itemDetails.status === "Available";

    // Adjust description length based on screen size
    const descriptionLength = isMobile ? 40 : 80;

    return (
        <div className="cart-item">
            <div className="item-image">
                {itemDetails.imageUrls && itemDetails.imageUrls.length > 0 ? (
                    <img 
                        src={itemDetails.imageUrls[0]} 
                        alt={itemDetails.name}
                        onClick={() => navigate(itemUrl)}
                    />
                ) : (
                    <div className="no-image" onClick={() => navigate(itemUrl)}>
                        <i className="fa-solid fa-image"></i>
                    </div>
                )}
            </div>

            <div className="item-details">
                <div className="item-header">
                    <span className="item-number">[{itemNumber}]</span>
                    <h3 className="item-name" onClick={() => navigate(itemUrl)}>
                        {itemDetails.name}
                    </h3>
                </div>

                {itemDetails.description && (
                    <p className="item-description">
                        {itemDetails.description.substring(0, descriptionLength)}
                        {itemDetails.description.length > descriptionLength ? "..." : ""}
                    </p>
                )}

                <div className="item-status">
                    <span className={`status-badge ${itemDetails.status.replace(/\s+/g, '-')}`}>
                        {itemDetails.status}
                    </span>
                </div>

                {!isAvailable && (
                    <div className="unavailable-notice">
                        This item is no longer available and will be removed at checkout.
                    </div>
                )}
            </div>

            <div className="item-actions">
                <div className="item-price">
                    {hasPrice ? `$${(itemDetails.price * quantity).toFixed(2)}` : "Contact for pricing"}
                    {hasPrice && quantity > 1 && (
                        <span className="unit-price">${itemDetails.price.toFixed(2)} each</span>
                    )}
                </div>

                {itemType === 'accessory' && (
                    <div className="quantity-controls">
                        <button 
                            onClick={() => onUpdateQuantity(itemGuid, quantity - 1)}
                            disabled={quantity <= 1}
                            className="quantity-btn"
                        >
                            -
                        </button>
                        <span className="quantity">{quantity}</span>
                        <button 
                            onClick={() => onUpdateQuantity(itemGuid, quantity + 1)}
                            disabled={quantity >= 5}
                            className="quantity-btn"
                        >
                            +
                        </button>
                    </div>
                )}

                {itemType === 'cue' && (
                    <div className="quantity-info">
                        <div>Quantity: 1</div>
                        <div>(cues are unique)</div>
                    </div>
                )}

                <button 
                    onClick={() => onRemove(itemGuid)}
                    className="remove-btn"
                >
                    <i className="fa-solid fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    );
}
