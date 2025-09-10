import React from "react";
import { useNavigate } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="not-found-icon">
                        <i className="fa-solid fa-question-circle"></i>
                    </div>
                    <h1 className="not-found-title">404</h1>
                    <h2 className="not-found-subtitle">Page Not Found</h2>
                    <p className="not-found-message">
                        Oops! The page you're looking for seems to have wandered off into the cue rack. 
                        Let's get you back on track.
                    </p>
                    <div className="not-found-actions">
                        <DefaultButton 
                            text="Go Back" 
                            onClick={handleGoBack}
                            className="not-found-btn primary"
                        />
                        <DefaultButton 
                            text="Home" 
                            onClick={() => navigate("/")}
                            className="not-found-btn secondary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}