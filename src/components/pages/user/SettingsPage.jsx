import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import AccountSection from "../../sections/AccountSection";
import { userChangePassword } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";
import { FormField } from "../../util/Inputs";
import { useSelector } from "react-redux";
import { DefaultButton } from "../../util/Buttons";
import { checkUserAuth } from "../../../util/functions";
import { userToggleNotifications } from "../../../util/requests";

import {generate2FA} from "../../../util/requests"
import {verify2FA} from "../../../util/requests"

export default function SettingsPage() {
    const userData = useSelector(state => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPWModalOpen, setIsPWModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset, watch, setFocus: set2FAFocus } = useForm();
    const { register: pwRegister, handleSubmit: pwHandleSubmit, watch: pwWatch, formState: { errors: pwErrors }, reset: pwReset, setFocus: setPWFocus } = useForm({
            defaultValues: {
                currPassword: "",
                newPassword: "",
            }
        });

    const verCode = watch("verCode");
    const currPassword = pwWatch("currPassword");
    const newPassword = pwWatch("newPassword");

    const onGenerate = (data) => {
        if (loading) return;
        setLoading(true);

        generate2FA()
            .then((res) => {
                receiveResponse(res);
                setQrCodeUrl(res.data.qrcodeUrl);
                setIsModalOpen(true);
                checkUserAuth();
            })
            .always(() => {
                setLoading(false);
            });
    }

    const onToggle = (data) => {
        if (loading) return;
        setLoading(true);
        userToggleNotifications()
            .then((res) => {
                receiveResponse(res);
                checkUserAuth();
            })
            .always(() => {
                setLoading(false);
            });

    }

    const onSubmit = (data) => {
        if (loading) return;
        setLoading(true);
        verify2FA(data.verCode)
            .then((res) => {
                receiveResponse(res);
                checkUserAuth();
                setIsModalOpen(false);
                setQrCodeUrl(null);
                pwReset();
            })
            .always(() => {
                setLoading(false);
            });
    }

    const handleCloseDialog = () => {
        setIsPWModalOpen(false);
        pwReset({ currPassword: "", newPassword: "" });
    };
    
    const onChangePassword = (data) => {
        setIsPWModalOpen(true);
        if(loading) return;
        setLoading(true);
        userChangePassword(data.currPassword, data.newPassword)
            .then((res) => {
                receiveResponse(res);
                checkUserAuth();
                setIsPWModalOpen(false);
                pwReset({ currPassword: "", newPassword: "" });
            })
            .always(() => {
                setLoading(false);
                pwReset({ currPassword: "", newPassword: "" });
            });
        
    }

    return (
        <div className="user-content">
            <AccountSection title="Password" onEdit={() => setIsPWModalOpen(true)}/>
            <AccountSection title="Two factor authentication" onEdit={!userData.TFAEnabled && onGenerate}>
                {userData.TFAEnabled ? (
                    <p>Two Factor Authentication is Setup!</p>
                ) : (
               
                    <p>No 2FA</p>
                )}
            </AccountSection>
            <AccountSection title="Notifications" onEdit={ onToggle }>
                {userData.emailNotos ? (
                    <p>You currently have email notifications enabled!</p>
                ) : (
               
                    <p>You currently have email notifications disabled!</p>
                )}
            </AccountSection>

           {/* Modal */}
           <Dialog 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                fullWidth 
                maxWidth="sm" 
                className="miller-dialog-typography"
                PaperProps={{ 
                    className: "miller-dialog-typography",
                    style: { borderRadius: 0 }
                }}
                TransitionProps={{ onEntered: () => set2FAFocus("verCode") }}
            >
                <DialogTitle>
                    Setup Two-Factor Authentication
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-column" style={{ width: '100%' }}>
                            <div className="form-row" style={{ width: '100%' }}>
                                <div className="flex-1">
                                <img 
                                    src={qrCodeUrl} 
                                    alt="2FA QR Code"
                                    style={{ 
                                        width: "100%", 
                                        height: "100%", 
                                        maxHeight: "300px",
                                        maxWidth: "300px",
                                        display: "block", 
                                        margin: "0 auto 20px" 
                                    }}
                                />
                                </div>
                                
                            </div>
                            <div className="form-row" style={{ width: '100%' }}>
                                <div className="flex-1">
                                    <FormField
                                        title="Code"
                                        type="verCode"
                                        value={verCode}
                                        error={errors.verCode && errors.verCode?.message}
                                        {...register("verCode", { 
                                            required: "Verification code is required.",
                                            pattern: {
                                                value: /^\d+$/,
                                                message: "Code must contain only digits."
                                            }
                                        })}
                                    />
                                    
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                                <span 
                                    onClick={() => setIsModalOpen(false)} 
                                    style={{ 
                                        textDecoration: 'underline', 
                                        cursor: 'pointer',
                                        color: '#333',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Cancel
                                </span>
                                <DefaultButton
                                    text="Verify Code"
                                    type="submit"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </form>
                </DialogContent>


            </Dialog>
            {/*Password Change Modal */}
            <Dialog 
                open={isPWModalOpen} 
                onClose={() => setIsPWModalOpen(false)} 
                fullWidth 
                maxWidth="sm" 
                className="miller-dialog-typography"
                PaperProps={{ 
                    className: "miller-dialog-typography",
                    style: { borderRadius: 0 }
                }}
                TransitionProps={{ onEntered: () => setPWFocus("currPassword") }}
            >
                <DialogTitle>
                    Change your Password:

                </DialogTitle>
                <DialogContent>
                    <form onSubmit={pwHandleSubmit(onChangePassword)}>
                        <div className="form-column">
                            <div className="form-row">
                                <div className="form-column flex-1">
                                    <FormField
                                        title="Current Password"
                                        type="password"
                                        value={currPassword}
                                        error={pwErrors.currPassword && pwErrors.currPassword?.message}
                                        {...pwRegister("currPassword", { 
                                            required: "Your current password is required.",
                                        })}
                                    />
                                    <FormField
                                        title="New Password"
                                        type="password"
                                        value={newPassword}
                                        error={pwErrors.newPassword && pwErrors.newPassword?.message}
                                        {...pwRegister("newPassword", { 
                                            required: "New password is required.",
                                        })}
                                    />
                                    
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                                <span 
                                    onClick={handleCloseDialog} 
                                    style={{ 
                                        textDecoration: 'underline', 
                                        cursor: 'pointer',
                                        color: '#333',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Cancel
                                </span>
                                <DefaultButton
                                    text="Change Password"
                                    type="submit"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}