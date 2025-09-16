import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";

export default function CheckoutFailurePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const error = searchParams.get('error') || 'Payment verification failed';

    return (
        <div className="checkout-result-page">
            <div className="checkout-result-container">
                <div className="failure-content">
                    <div className="failure-icon">
                        <i className="fa-solid fa-circle-exclamation"></i>
                    </div>
                    
                    <h1>Payment Verification Failed</h1>
                    <p>{error}</p>
                    <p>If you were charged, please contact our support team immediately with the information below.</p>
                    
                    {sessionId && (
                        <div className="error-details">
                            <p><strong>Session ID:</strong> {sessionId}</p>
                            <p><em>Please reference this ID when contacting support.</em></p>
                        </div>
                    )}
                    
                    <div className="failure-actions">
                        <DefaultButton 
                            text="Contact Support" 
                            onClick={() => navigate("/pages/contact-us")}
                        />
                        <DefaultButton 
                            text="Return to Cart" 
                            onClick={() => navigate("/cart")}
                            className="secondary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}