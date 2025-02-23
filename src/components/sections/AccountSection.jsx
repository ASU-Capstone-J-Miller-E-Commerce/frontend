import React from "react";

export default function AccountSection({ title, children }) {
    return (
        <section className="account-section-wrapper">
            <h2 className="account-section-title">{title}</h2>
            <div className="account-section">
                <div className="account-section-content">
                    {children}
                </div>
            </div>
        </section>
    );
}