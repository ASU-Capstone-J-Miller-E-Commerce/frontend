import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountSection from "../../sections/AccountSection";
import { DefaultButton } from "../../util/Buttons";
import { getUserOrders } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrderDetail();
    }, [orderId]);

    const loadOrderDetail = () => {
        setLoading(true);
        getUserOrders()
            .then((response) => {
                const foundOrder = response.data.find(o => o.orderId === orderId);
                if (foundOrder) {
                    setOrder(foundOrder);
                } else {
                    navigate('/account/orders');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading order:', error);
                receiveResponse(error);
                navigate('/account/orders');
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusDisplay = (orderStatus) => {
        const statusMap = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'delivery_exception': 'Delivery Exception',
            'cancelled': 'Cancelled'
        };
        return statusMap[orderStatus] || orderStatus;
    };

    const getStatusIcon = (orderStatus) => {
        const iconMap = {
            'pending': 'fa-clock',
            'confirmed': 'fa-check-circle',
            'shipped': 'fa-truck',
            'delivered': 'fa-box-check',
            'delivery_exception': 'fa-exclamation-triangle',
            'cancelled': 'fa-times-circle'
        };
        return iconMap[orderStatus] || 'fa-clock';
    };

    if (loading) {
        return (
            <div className="user-content">
                <AccountSection title="Order Details">
                    <div className="loading-content">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <p>Loading order details...</p>
                    </div>
                </AccountSection>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="user-content">
                <AccountSection title="Order Details">
                    <div className="error-content">
                        <i className="fa-solid fa-exclamation-triangle"></i>
                        <h3>Order not found</h3>
                        <p>The order you're looking for could not be found.</p>
                        <DefaultButton 
                            text="Back to Orders" 
                            onClick={() => navigate('/account/orders')}
                        />
                    </div>
                </AccountSection>
            </div>
        );
    }

    return (
        <div className="user-content">
            <AccountSection title={
                <div className="order-detail-header">
                    <button 
                        className="btn-back"
                        onClick={() => navigate('/account/orders')}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Order {order.orderId}</span>
                    </button>
                </div>
            }>
                <div className="order-detail-content">
                    {/* Order Status */}
                    <div className="order-status-section">
                        <div className="status-info">
                            <i className={`fa-solid ${getStatusIcon(order.orderStatus)}`}></i>
                            <div>
                                <h3>{getStatusDisplay(order.orderStatus)}</h3>
                                <p>Confirmed {formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                        
                        {order.trackingNumber && (
                            <div className="tracking-info">
                                <h4>Tracking Information</h4>
                                <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                                {order.shippingCarrier && (
                                    <p><strong>Carrier:</strong> {order.shippingCarrier}</p>
                                )}
                                {order.expectedDelivery && (
                                    <p><strong>Expected Delivery:</strong> {formatDate(order.expectedDelivery)}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="order-items-section">
                        <h3>Items Ordered</h3>
                        
                        {/* Cues */}
                        {order.orderItems.cueDetails && order.orderItems.cueDetails.length > 0 && (
                            <div className="item-category">
                                <h4>Cues ({order.orderItems.cueDetails.length})</h4>
                                <div className="items-list">
                                    {order.orderItems.cueDetails.map((cue, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-image">
                                                {cue.imageUrls && cue.imageUrls.length > 0 ? (
                                                    <img src={cue.imageUrls[0]} alt={cue.name} />
                                                ) : (
                                                    <div className="no-image">
                                                        <i className="fa-solid fa-image"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="item-details">
                                                <h5>{cue.name}</h5>
                                                <p>Cue #{cue.cueNumber}</p>
                                                <p className="item-price">${cue.price?.toFixed(2)}</p>
                                            </div>
                                            <div className="item-quantity">
                                                <span>Quantity: 1</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accessories */}
                        {order.orderItems.accessoryDetails && order.orderItems.accessoryDetails.length > 0 && (
                            <div className="item-category">
                                <h4>Accessories</h4>
                                <div className="items-list">
                                    {order.orderItems.accessoryDetails.map((accessory, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-image">
                                                {accessory.imageUrls && accessory.imageUrls.length > 0 ? (
                                                    <img src={accessory.imageUrls[0]} alt={accessory.name} />
                                                ) : (
                                                    <div className="no-image">
                                                        <i className="fa-solid fa-image"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="item-details">
                                                <h5>{accessory.name}</h5>
                                                <p>Accessory #{accessory.accessoryNumber}</p>
                                                <p className="item-price">${accessory.price?.toFixed(2)}</p>
                                            </div>
                                            <div className="item-quantity">
                                                <span>Quantity: {accessory.quantity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-section">
                        <h3>Order Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span><strong>Order Number:</strong></span>
                                <span>{order.orderId}</span>
                            </div>
                            <div className="summary-row">
                                <span><strong>Order Date:</strong></span>
                                <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="summary-row">
                                <span><strong>Payment Status:</strong></span>
                                <span className="payment-status">{order.paymentStatus}</span>
                            </div>
                            <div className="summary-row">
                                <span><strong>Payment Method:</strong></span>
                                <span>{order.paymentMethod}</span>
                            </div>
                            <div className="summary-row total">
                                <span><strong>Total Amount:</strong></span>
                                <span><strong>${order.totalAmount.toFixed(2)} {order.currency.toUpperCase()}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="addresses-section">
                        <div className="address-group">
                            {/* Shipping Address */}
                            {order.shippingAddress && order.shippingAddress.address && (
                                <div className="address-card">
                                    <h4>Shipping Address</h4>
                                    <div className="address">
                                        {order.shippingAddress.name && <div><strong>{order.shippingAddress.name}</strong></div>}
                                        <div>{order.shippingAddress.address.line1}</div>
                                        {order.shippingAddress.address.line2 && (
                                            <div>{order.shippingAddress.address.line2}</div>
                                        )}
                                        <div>
                                            {order.shippingAddress.address.city}, {order.shippingAddress.address.state} {order.shippingAddress.address.postal_code}
                                        </div>
                                        <div>{order.shippingAddress.address.country}</div>
                                        {order.shippingAddress.phone && (
                                            <div>Phone: {order.shippingAddress.phone}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Billing Address */}
                            {order.billingAddress && (
                                <div className="address-card">
                                    <h4>Billing Address</h4>
                                    <div className="address">
                                        <div>{order.billingAddress.line1}</div>
                                        {order.billingAddress.line2 && (
                                            <div>{order.billingAddress.line2}</div>
                                        )}
                                        <div>
                                            {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postal_code}
                                        </div>
                                        <div>{order.billingAddress.country}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="next-steps-section">
                        <h3>What's Next?</h3>
                        <ul>
                            <li>You will receive a confirmation email shortly</li>
                            <li>Your items will be prepared for shipment</li>
                            <li>You'll receive tracking information once shipped</li>
                            <li>For questions, contact us with your order number</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="order-actions">
                        <DefaultButton 
                            text="Back to Orders" 
                            onClick={() => navigate('/account/orders')}
                            className="secondary"
                        />
                        <DefaultButton 
                            text="Continue Shopping" 
                            onClick={() => navigate('/collections/cues')}
                        />
                    </div>
                </div>
            </AccountSection>
        </div>
    );
}