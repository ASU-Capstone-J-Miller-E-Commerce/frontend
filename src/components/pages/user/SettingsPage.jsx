import React from "react";
import AccountSection from "../../sections/AccountSection";

export default function SettingsPage() {
    return (
        <div>
            <AccountSection title="Password">
                <p>password</p>
            </AccountSection>
            <AccountSection title="Two factor authentication">
                <p>Setup two factor authentication</p>
            </AccountSection>
            <AccountSection title="Notifications">
                <p>notifications</p>
            </AccountSection>
        </div>
    )
}