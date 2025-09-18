import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountSection from "../../sections/AccountSection";
import { DefaultButton } from "../../util/Buttons";
import { getUserOrderById } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getUserOrderById(orderId)
            .then(response => {
                if (response.status === "success" && response.data) {
                    setOrder(response.data);
                } else {
                    setOrder(null);
                }
                setLoading(false);
            })
            .catch(err => {
                setOrder(null);
                setLoading(false);
            });
    }, [orderId]);


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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
                <div className="order-detail-loading">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="user-content">
                <div className="order-detail-error">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    <h3>Order not found</h3>
                    <p>The order you're looking for could not be found.</p>
                    <DefaultButton 
                        text="Back to Orders" 
                        onClick={() => navigate('/account/orders')}
                    />
                </div>
            </div>
        );
    }

    // Merge cues and accessories into a single list
    const allItems = [
        ...(order.orderItems.cueDetails || []).map(cue => ({
            ...cue,
            type: 'cue',
            quantity: 1
        })),
        ...(order.orderItems.accessoryDetails || []).map(acc => ({
            ...acc,
            type: 'accessory',
            quantity: acc.quantity
        }))
    ];

    return (
        <div className="user-content">
            <div className="order-detail-page compact">
                <div className="order-detail-header compact">
                    <button 
                        className="btn-back compact"
                        onClick={() => navigate('/account/orders')}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div className="order-id-block">
                        <span className="order-id">Order {order.orderId}</span>
                        <span className="order-confirm-date">Confirmed {formatDate(order.createdAt)}</span>
                    </div>
                </div>
                <div className="order-detail-main compact">
                    {/* Left Column */}
                    <div className="order-detail-left compact">
                        {/* Status Card */}
                        <div className="order-card order-status-card compact">
                            <div className="status-info compact">
                                <i className={`fa-solid ${getStatusIcon(order.orderStatus)}`}></i>
                                <div>
                                    <h3>{getStatusDisplay(order.orderStatus)}</h3>
                                </div>
                            </div>
                            {order.trackingNumber && (
                                <div className="tracking-info compact">
                                    <h4>Tracking Information</h4>
                                    {order.shippingCarrier && (
                                        <p><strong>Carrier:</strong> {order.shippingCarrier}</p>
                                    )}
                                    <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                                    {order.expectedDelivery && (
                                        <p><strong>Expected Delivery:</strong> {formatDate(order.expectedDelivery)}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Contact + Addresses Card */}
                        <div className="order-card order-address-card compact">
                            <div className="contact-info compact">
                                <div className="contact-details">
                                    <h4>Contact Information</h4>
                                    <div>{order.customer}</div>
                                    {order.customerEmail && <div>{order.customerEmail}</div>}
                                </div>
                            </div>
                            <div className="address-group compact">
                                {/* Shipping Address */}
                                {order.shippingAddress && order.shippingAddress.address && (
                                    <div className="address-card compact">
                                        <h4>Shipping Address</h4>
                                        <div className="address compact">
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
                                                <div>{order.shippingAddress.phone}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Billing Address */}
                                {order.billingAddress && (
                                    <div className="address-card compact">
                                        <h4>Billing Address</h4>
                                        <div className="address compact">
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
                    </div>

                    {/* Right Column: Order Items */}
                    <div className="order-detail-right compact">
                        <div className="order-card order-items-card compact">
                            <h4>Items Ordered</h4>
                            <div className="items-list compact">
                                {allItems.length > 0 ? (
                                    <ul>
                                        {allItems.map((item, index) => (
                                            <li key={index} className="order-item compact">
                                                <div className="order-detail-item-image compact large">
                                                    {item.imageUrls && item.imageUrls.length > 0 ? (
                                                        <img src={item.imageUrls[0]} alt={item.name} />
                                                    ) : (
                                                        <div className="no-image compact large">
                                                            <i className="fa-solid fa-image"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="item-details compact">
                                                    <h5>{item.name}</h5>
                                                    <p>{item.type === 'cue' ? `Cue #${item.cueNumber}` : `Accessory #${item.accessoryNumber}`}</p>
                                                    <p className="item-price compact">${item.price?.toFixed(2)}</p>
                                                </div>
                                                <div className="item-quantity compact">
                                                    <span>Quantity: {item.quantity}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>No items found.</div>
                                )}
                            </div>
                            {/* Total Amount Below Items */}
                            <div className="order-total-amount compact">
                                <span><strong>Total Amount:</strong></span>
                                <span><strong>${order.totalAmount.toFixed(2)} {order.currency.toUpperCase()}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}