import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        setLoading(true);
        getUserOrders()
            .then((response) => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch((error) => {
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

    const getTotalImageCount = (order) => {
        const cueCount = order.orderItems.cueDetails ? Math.min(order.orderItems.cueDetails.length, 4) : 0;
        const accessoryCount = order.orderItems.accessoryDetails ? Math.min(order.orderItems.accessoryDetails.length, 4 - cueCount) : 0;
        return cueCount + accessoryCount;
    };

    const handleOrderClick = (orderId) => {
        navigate(`/account/orders/${orderId}`);
    };

    if (loading) {
        return <OrdersSkeleton viewMode={viewMode} />;
    }

    return (
        <div className="user-content">
            <div className="orders-page">          
                {orders.length === 0 ? (
                    <div className="no-orders-card">
                        <i className="fa-solid fa-box-open"></i>
                        <h3>No orders yet</h3>
                        <p>When you place your first order, it will appear here.</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/collections/cues?available=true')}
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className={`orders-container ${viewMode}-view`}>
                        {viewMode === 'list' && (
                            <div className="orders-table-header desktop-only">
                                <div className="col-images"></div>
                                <h2 className="col-order account-section-title">Order</h2>
                                <h2 className="col-status account-section-title">Status</h2>
                                <h2 className="col-total account-section-title">Total</h2>
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
                                            <div className={`order-images images-${getTotalImageCount(order)}`}>
                                                {/* Show up to 4 unique product images */}
                                                {order.orderItems.cueDetails && order.orderItems.cueDetails.slice(0, 4).map((cue, index) => (
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
                                                {order.orderItems.accessoryDetails && order.orderItems.accessoryDetails.slice(0, 4 - (order.orderItems.cueDetails?.length || 0)).map((accessory, index) => (
                                                    <div key={`acc-${index}`} className="order-item-image">
                                                        {accessory.imageUrls && accessory.imageUrls.length > 0 ? (
                                                            <img src={accessory.imageUrls[0]} alt={accessory.name} />
                                                        ) : (
                                                            <div className="no-image">
                                                                <i className="fa-solid fa-image"></i>
                                                            </div>
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
                                        <div className={`order-images images-${getTotalImageCount(order)}`}>
                                            {order.orderItems.cueDetails && order.orderItems.cueDetails.slice(0, 4).map((cue, index) => (
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
                                            {order.orderItems.accessoryDetails && order.orderItems.accessoryDetails.slice(0, 4 - (order.orderItems.cueDetails?.length || 0)).map((accessory, index) => (
                                                <div key={`acc-${index}`} className="order-item-image">
                                                    {accessory.imageUrls && accessory.imageUrls.length > 0 ? (
                                                        <img src={accessory.imageUrls[0]} alt={accessory.name} />
                                                    ) : (
                                                        <div className="no-image">
                                                            <i className="fa-solid fa-image"></i>
                                                        </div>
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

// OrdersSkeleton Component
function OrdersSkeleton({ viewMode = 'list' }) {
    return (
        <div className="user-content">
            <div className="orders-page">
                <div className={`orders-container ${viewMode}-view`}>
                    {viewMode === 'list' && (
                        <div className="orders-table-header desktop-only skeleton-header">
                            <div className="col-images">
                                <div className="skeleton-table-header-item"></div>
                            </div>
                            <div className="col-order">
                                <div className="skeleton-table-header-item skeleton-table-header-wide"></div>
                            </div>
                            <div className="col-status">
                                <div className="skeleton-table-header-item skeleton-table-header-medium"></div>
                            </div>
                            <div className="col-total">
                                <div className="skeleton-table-header-item skeleton-table-header-medium"></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Generate 4 skeleton items */}
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className={`order-item skeleton-order-item ${viewMode === 'list' ? 'order-list-item' : 'order-card'}`}>
                            {viewMode === 'list' ? (
                                <>
                                    {/* Images Column */}
                                    <div className="col-images">
                                        <div className="order-images skeleton-order-images">
                                            <div className="skeleton-order-image"></div>
                                            <div className="skeleton-order-image"></div>
                                            <div className="skeleton-order-image"></div>
                                            <div className="skeleton-order-image"></div>
                                        </div>
                                    </div>

                                    {/* Order Column */}
                                    <div className="col-order">
                                        <div className="skeleton-order-number"></div>
                                        <div className="skeleton-order-summary"></div>
                                        <div className="skeleton-order-date"></div>
                                    </div>

                                    {/* Status Column */}
                                    <div className="col-status">
                                        <div className="skeleton-order-status">
                                            <div className="skeleton-status-icon"></div>
                                            <div className="skeleton-status-text"></div>
                                        </div>
                                    </div>

                                    {/* Total Column */}
                                    <div className="col-total">
                                        <div className="skeleton-total-amount"></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Card Layout */}
                                    <div className="skeleton-order-status-card">
                                        <div className="skeleton-status-icon"></div>
                                        <div className="skeleton-status-text"></div>
                                        <div className="skeleton-order-date"></div>
                                    </div>

                                    {/* Order Images */}
                                    <div className="order-images skeleton-order-images-card">
                                        <div className="skeleton-order-image"></div>
                                        <div className="skeleton-order-image"></div>
                                        <div className="skeleton-order-image"></div>
                                        <div className="skeleton-order-image"></div>
                                    </div>

                                    {/* Order Info */}
                                    <div className="order-info">
                                        <div className="order-details">
                                            <div className="skeleton-order-number"></div>
                                            <div className="skeleton-order-summary"></div>
                                        </div>
                                        <div className="order-total">
                                            <div className="skeleton-total-amount"></div>
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <div className="skeleton-order-button"></div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}