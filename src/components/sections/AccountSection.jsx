import React from "react";

export default function AccountSection({ title, children, onEdit }) {
    return (
        <section className="account-section-wrapper">
            <div className="account-section-header">
                <div className="flex-h"> 
                    <h2 className="account-section-title">{title}</h2>
                    {onEdit && (
                        <button
                            type="button"
                            className="fa-solid fa-pencil account-action-button"
                            onClick={onEdit}
                        />
                    )}
                </div> 
            </div>
            <div className="account-section">
                <div className="account-section-content">
                    {children}
                </div>
            </div>
        </section>
    );
}