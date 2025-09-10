import React from "react";
import { useNavigate } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";

export default function CheckoutCancelPage() {
    const navigate = useNavigate();

    return (
        <div className="checkout-result-page">
            <div className="checkout-result-container">
                <div className="cancel-content">
                    <div className="cancel-icon">
                        <i className="fa-solid fa-circle-xmark"></i>
                    </div>
                    
                    <h1>Payment Cancelled</h1>
                    <p>Your payment was cancelled. No charges have been made to your account.</p>
                    <p>Your items are still in your cart if you'd like to try again.</p>
                    
                    <div className="cancel-actions">
                        <DefaultButton 
                            text="Return to Cart" 
                            onClick={() => navigate("/cart")}
                        />
                        <DefaultButton 
                            text="Continue Shopping" 
                            onClick={() => navigate("/collections/cues")}
                            className="secondary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
