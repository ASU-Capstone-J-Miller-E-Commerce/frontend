import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";
import { getCart, updateCartItem, removeFromCart, clearCart } from "../../util/requests";
import { receiveErrors, receiveLogs } from "../../util/notifications";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await getCart();
            if (response?.success) {
                setCartItems(response.data.items || []);
                setTotalItems(response.data.totalItems || 0);
            } else {
                receiveErrors("Failed to load cart");
            }
        } catch (error) {
            receiveErrors("Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        updateCartItem(cartItemId, newQuantity)
            .then(() => {
                loadCart();
                receiveLogs("Cart updated");
            })
            .catch(() => {
                receiveErrors("Failed to update cart");
            });
    };

    const handleRemoveItem = async (cartItemId) => {
        removeFromCart(cartItemId)
            .then(() => {
                loadCart();
                receiveLogs("Item removed from cart");
            })
            .catch(() => {
                receiveErrors("Failed to remove item");
            });
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your entire cart?")) {
            return;
        }

        clearCart()
            .then(() => {
                setCartItems([]);
                setTotalItems(0);
                receiveLogs("Cart cleared");
            })
            .catch(() => {
                receiveErrors("Failed to clear cart");
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

    if (loading) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="cart-loading">Loading cart...</div>
                </div>
            </div>
        );
    }

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
                                key={item.cartItemId}
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
    const { itemDetails, quantity, cartItemId, itemType } = item;
    const navigate = useNavigate();

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
                        {itemDetails.description.substring(0, 150)}
                        {itemDetails.description.length > 150 ? "..." : ""}
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
                            onClick={() => onUpdateQuantity(cartItemId, quantity - 1)}
                            disabled={quantity <= 1}
                            className="quantity-btn"
                        >
                            -
                        </button>
                        <span className="quantity">{quantity}</span>
                        <button 
                            onClick={() => onUpdateQuantity(cartItemId, quantity + 1)}
                            className="quantity-btn"
                        >
                            +
                        </button>
                    </div>
                )}

                {itemType === 'cue' && (
                    <div className="quantity-info">
                        Quantity: 1 (cues are unique)
                    </div>
                )}

                <button 
                    onClick={() => onRemove(cartItemId)}
                    className="remove-btn"
                >
                    <i className="fa-solid fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    );
}
