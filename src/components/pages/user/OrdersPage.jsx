import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountSection from "../../sections/AccountSection";
import { getUserOrders } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        setLoading(true);
        getUserOrders()
            .then((response) => {
                console.log(response)
                setOrders(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading orders:', error);
                receiveResponse(error);
                setLoading(false);
            });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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

    const handleOrderClick = (orderId) => {
        navigate(`/account/orders/${orderId}`);
    };

    if (loading) {
        return (
            <div className="user-content">
                <div className="orders-page">
                    <div className="orders-header">
                    </div>
                    <div className="loading-content">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-content">
            <div className="orders-page">
                <div className="orders-header">
                    <div className="view-toggle desktop-only">
                        <button 
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <i className="fa-solid fa-grip"></i>
                        </button>
                        <button 
                            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <i className="fa-solid fa-list"></i>
                        </button>
                    </div>
                </div>
                
                {orders.length === 0 ? (
                    <div className="no-orders-card">
                        <i className="fa-solid fa-box-open"></i>
                        <h3>No orders yet</h3>
                        <p>When you place your first order, it will appear here.</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/collections/cues')}
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className={`orders-container ${viewMode}-view`}>
                        {viewMode === 'list' && (
                            <div className="orders-table-header desktop-only">
                                <div className="col-images"></div>
                                <div className="col-order">Order</div>
                                <div className="col-status">Status</div>
                                <div className="col-total">Total</div>
                            </div>
                        )}
                        {orders.map((order) => (
                            <div 
                                key={order.orderId} 
                                className={`order-item ${viewMode === 'list' ? 'order-list-item' : 'order-card'}`}
                                onClick={() => handleOrderClick(order.orderId)}
                            >
                                {viewMode === 'list' ? (
                                    <>
                                        {/* Images Column */}
                                        <div className="col-images">
                                            <div className="order-images">
                                                {order.orderItems.cueDetails && order.orderItems.cueDetails.map((cue, index) => (
                                                    <div key={index} className="order-item-image">
                                                        {cue.imageUrls && cue.imageUrls.length > 0 ? (
                                                            <img src={cue.imageUrls[0]} alt={cue.name} />
                                                        ) : (
                                                            <div className="no-image">
                                                                <i className="fa-solid fa-image"></i>
                                                            </div>
                                                        )}
                                                        {order.totalItemCount > 1 && index === 0 && (
                                                            <div className="item-count-badge">{order.totalItemCount}</div>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.orderItems.accessoryDetails && order.orderItems.accessoryDetails.map((accessory, index) => (
                                                    <div key={index} className="order-item-image">
                                                        {accessory.imageUrls && accessory.imageUrls.length > 0 ? (
                                                            <img src={accessory.imageUrls[0]} alt={accessory.name} />
                                                        ) : (
                                                            <div className="no-image">
                                                                <i className="fa-solid fa-image"></i>
                                                            </div>
                                                        )}
                                                        {accessory.quantity > 1 && (
                                                            <div className="quantity-badge">{accessory.quantity}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Column */}
                                        <div className="col-order">
                                            <div className="order-number">
                                                <strong>Order {order.orderId}</strong>
                                            </div>
                                            <div className="order-summary">
                                                {order.totalItemCount} item{order.totalItemCount !== 1 ? 's' : ''}
                                            </div>
                                            <div className="order-date">{formatDate(order.createdAt)}</div>
                                        </div>

                                        {/* Status Column */}
                                        <div className="col-status">
                                            <div className="order-status">
                                                <i className={`fa-solid ${getStatusIcon(order.orderStatus)}`}></i>
                                                <span>{getStatusDisplay(order.orderStatus)}</span>
                                            </div>
                                        </div>

                                        {/* Total Column */}
                                        <div className="col-total">
                                            <span className="total-amount">
                                                ${order.totalAmount.toFixed(2)} {order.currency.toUpperCase()}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="order-status">
                                            <i className={`fa-solid ${getStatusIcon(order.orderStatus)}`}></i>
                                            <span>{getStatusDisplay(order.orderStatus)}</span>
                                            <span className="order-date">{formatDate(order.createdAt)}</span>
                                        </div>

                                        {/* Order Images */}
                                        <div className="order-images">
                                            {order.orderItems.cueDetails && order.orderItems.cueDetails.map((cue, index) => (
                                                <div key={index} className="order-item-image">
                                                    {cue.imageUrls && cue.imageUrls.length > 0 ? (
                                                        <img src={cue.imageUrls[0]} alt={cue.name} />
                                                    ) : (
                                                        <div className="no-image">
                                                            <i className="fa-solid fa-image"></i>
                                                        </div>
                                                    )}
                                                    {order.totalItemCount > 1 && index === 0 && (
                                                        <div className="item-count-badge">{order.totalItemCount}</div>
                                                    )}
                                                </div>
                                            ))}
                                            {order.orderItems.accessoryDetails && order.orderItems.accessoryDetails.map((accessory, index) => (
                                                <div key={index} className="order-item-image">
                                                    {accessory.imageUrls && accessory.imageUrls.length > 0 ? (
                                                        <img src={accessory.imageUrls[0]} alt={accessory.name} />
                                                    ) : (
                                                        <div className="no-image">
                                                            <i className="fa-solid fa-image"></i>
                                                        </div>
                                                    )}
                                                    {accessory.quantity > 1 && (
                                                        <div className="quantity-badge">{accessory.quantity}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Info */}
                                        <div className="order-info">
                                            <div className="order-details">
                                                <div className="order-number">
                                                    <span><strong>Order {order.orderId}</strong></span>
                                                </div>
                                                <div className="order-summary">
                                                    <span>{order.totalItemCount} item{order.totalItemCount !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="order-total">
                                                <span className="total-amount">
                                                    ${order.totalAmount.toFixed(2)} {order.currency.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="order-actions">
                                            <button className="btn-secondary">
                                                View Details
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}