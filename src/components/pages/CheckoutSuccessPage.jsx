import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DefaultButton } from "../util/Buttons";
import { verifyPaymentSession } from "../../util/requests";
import { receiveResponse } from "../../util/notifications";
import { clearCartRedux } from "../../util/redux/actionCreators";

export default function CheckoutSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [sessionId, setSessionId] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session_id = searchParams.get('session_id');
        if (session_id) {
            setSessionId(session_id);
            verifyPayment(session_id);
        } else {
            navigate("/checkout/failure?error=" + encodeURIComponent("No payment session found"));
        }
    }, [searchParams, navigate]);

    const verifyPayment = (sessionId) => {
        verifyPaymentSession(sessionId)
            .then((response) => {
                setOrderDetails(response.data);
                clearCartRedux();
                
                receiveResponse(response);
                setLoading(false);
            })
            .catch((error) => {
                const errorMessage = error.errors?.[0] || "Failed to verify payment. Please contact support if you were charged.";
                
                navigate(`/checkout/failure?session_id=${sessionId}&error=${encodeURIComponent(errorMessage)}`);
                setLoading(false);
            });
    };

    if (loading) {
        return (
            <div className="checkout-result-page">
                <div className="checkout-result-container">
                    <div className="loading-content">
                        <div className="loading-spinner">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                        </div>
                        <h2>Verifying your payment...</h2>
                        <p>Please wait while we confirm your order.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-result-page">
            <div className="checkout-result-container">
                <div className="success-content">
                    <div className="success-icon">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    
                    <h1>Payment Successful!</h1>
                    <p>Thank you for your purchase. Your order has been processed successfully.</p>
                    
                    {orderDetails && (
                        <div className="order-details">
                            <div className="order-summary">
                                <h3>Order Summary</h3>
                                <div className="detail-row">
                                    <span><strong>Order Number:</strong></span>
                                    <span>{orderDetails.orderId}</span>
                                </div>
                                <div className="detail-row">
                                    <span><strong>Total Amount:</strong></span>
                                    <span>${orderDetails.amount.toFixed(2)} {orderDetails.currency.toUpperCase()}</span>
                                </div>
                                <div className="detail-row">
                                    <span><strong>Order Date:</strong></span>
                                    <span>{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {orderDetails.customer && (
                                <div className="customer-details">
                                    <h3>Customer Information</h3>
                                    <div className="detail-row">
                                        <span><strong>Email:</strong></span>
                                        <span>{orderDetails.customer.email}</span>
                                    </div>
                                    {orderDetails.customer.name && (
                                        <div className="detail-row">
                                            <span><strong>Name:</strong></span>
                                            <span>{orderDetails.customer.name}</span>
                                        </div>
                                    )}
                                    {orderDetails.customer.phone && (
                                        <div className="detail-row">
                                            <span><strong>Phone:</strong></span>
                                            <span>{orderDetails.customer.phone}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {orderDetails.shipping && (
                                <div className="shipping-details">
                                    <h3>Shipping Address</h3>
                                    <div className="address">
                                        {orderDetails.shipping.name && <div>{orderDetails.shipping.name}</div>}
                                        {orderDetails.shipping.address && (
                                            <>
                                                <div>{orderDetails.shipping.address.line1}</div>
                                                {orderDetails.shipping.address.line2 && (
                                                    <div>{orderDetails.shipping.address.line2}</div>
                                                )}
                                                <div>
                                                    {orderDetails.shipping.address.city}, {orderDetails.shipping.address.state} {orderDetails.shipping.address.postal_code}
                                                </div>
                                                <div>{orderDetails.shipping.address.country}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="order-items">
                                <h3>Items Ordered</h3>
                                {orderDetails.items.cues && orderDetails.items.cues.length > 0 && (
                                    <div className="item-category">
                                        <h4>Cues ({orderDetails.items.cues.length})</h4>
                                        <ul>
                                            {orderDetails.items.cues.map((cue, index) => (
                                                <li key={index}>{cue.name || `Cue ${cue.guid}`}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {orderDetails.items.accessories && orderDetails.items.accessories.length > 0 && (
                                    <div className="item-category">
                                        <h4>Accessories</h4>
                                        <ul>
                                            {orderDetails.items.accessories.map((accessory, index) => (
                                                <li key={index}>
                                                    {accessory.name || accessory.guid} (Quantity: {accessory.quantity})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="next-steps">
                                <h3>What's Next?</h3>
                                <ul>
                                    <li>You will receive a confirmation email shortly</li>
                                    <li>Your items will be prepared for shipment</li>
                                    <li>You'll receive tracking information once shipped</li>
                                    <li>For questions, contact us with your order number</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    <div className="success-actions">
                        <DefaultButton 
                            text="Continue Shopping" 
                            onClick={() => navigate("/collections/cues")}
                        />
                        <DefaultButton 
                            text="View Order" 
                            onClick={() => navigate(`/account/orders/${orderDetails.orderId}`)}
                            className="secondary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
