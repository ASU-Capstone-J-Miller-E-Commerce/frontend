import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";

export default function CheckoutSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const session_id = searchParams.get('session_id');
        if (session_id) {
            setSessionId(session_id);
            // You could make an API call here to verify the payment and update order status
            // verifyPayment(session_id);
        }
    }, [searchParams]);

    return (
        <div className="checkout-result-page">
            <div className="checkout-result-container">
                <div className="success-content">
                    <div className="success-icon">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    
                    <h1>Payment Successful!</h1>
                    <p>Thank you for your purchase. Your order has been processed successfully.</p>
                    
                    {sessionId && (
                        <div className="order-details">
                            <p><strong>Order Reference:</strong> {sessionId}</p>
                            <p>You will receive a confirmation email shortly with your order details.</p>
                        </div>
                    )}
                    
                    <div className="success-actions">
                        <DefaultButton 
                            text="Continue Shopping" 
                            onClick={() => navigate("/collections/cues")}
                        />
                        <DefaultButton 
                            text="View Orders" 
                            onClick={() => navigate("/account/orders")}
                            className="secondary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
