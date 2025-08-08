import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import AccountSection from "../../sections/AccountSection";
import { updateName } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";
import { FormField } from "../../util/Inputs";
import { useSelector } from "react-redux";
import { DefaultButton } from "../../util/Buttons";
import { checkUserAuth } from "../../../util/functions";

export default function ProfilePage() {
    const userData = useSelector(state => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, watch, setFocus } = useForm();

    const openModal = () => {
        setIsModalOpen(true);
        reset({ firstName: userData.firstName || "", lastName: userData.lastName || "" });  
    };

    const firstName = watch("firstName");
    const lastName = watch("lastName");

    const onSubmit = (data) => {
        if (loading) return;
        setIsModalOpen(false);
        setLoading(true);

        updateName(userData.email, data.firstName, data.lastName)
            .then((res) => {
                receiveResponse(res);
                checkUserAuth();
            })
            .always(() => {
                setLoading(false);
            });
    }

    return (
        <div className="user-content">
            <AccountSection title="Profile" onEdit={openModal}>
                <>
                    <div className="flex-h" style={{ alignItems: 'center', marginBottom: '1rem' }}>
                        <p style={{ 
                            margin: 0, 
                            minWidth: '60px' ,
                            whiteSpace: 'nowrap'
                        }}>Name:</p> 
                        <p style={{ 
                            margin: 0, 
                            marginLeft: '20px' 
                        }}>
                            {userData.firstName || "(No First Name)"} {userData.lastName || "(No Last Name)"}
                        </p>
                    </div>
                    
                    <div className="flex-h" style={{ alignItems: 'center' }}>
                        <p style={{ 
                            margin: 0, 
                            minWidth: '60px',
                            whiteSpace: 'nowrap'
                        }}>Email:</p>
                        <p style={{ 
                            margin: 0, 
                            marginLeft: '20px' 
                        }}>
                            {userData.email}
                        </p>
                    </div>
                </>
            </AccountSection>

            {/* Material UI Dialog */}
            <Dialog 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                fullWidth maxWidth="sm" 
                className="miller-dialog-typography"
                PaperProps={{
                    className: "miller-dialog-typography"
                }}
                TransitionProps={{ onEntered: () => setFocus("firstName") }}
            >
                <DialogTitle>
                    Edit Profile
                    <button
                        type="button"
                        className='fa-solid fa-xmark admin-action-button'
                        style={{ 
                            display: 'inline-block', 
                            justifySelf: 'right', 
                            fontSize: '1.5rem', 
                            marginTop: '-0.05rem',
                            float: 'right' 
                        }}
                        onClick={() => setIsModalOpen(false)}
                    />
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-column" style={{ width: '100%' }}>
                            <div className="form-row" style={{ width: '100%' }}>
                                <div className="flex-1">
                                    <FormField
                                        title="First Name"
                                        value={firstName}
                                        error={errors.firstName && errors.firstName.message}
                                        {...register("firstName", { 
                                            maxLength: {
                                                value: 30,
                                                message: "30 characters maximum"
                                            }
                                        })}
                                    />
                                </div>
                                
                                <div className="flex-1">
                                    <FormField
                                        title="Last Name"
                                        value={lastName}
                                        error={errors.lastName && errors.lastName.message}
                                        {...register("lastName", { 
                                            maxLength: {
                                                value: 30,
                                                message: "30 characters maximum"
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="form-row" style={{ width: '100%' }}>
                                <div className="flex-1">
                                    <FormField
                                        title="Email"
                                        value={userData.email}
                                        onChange={() => {}}
                                        disabled={true}
                                    />
                                    <p style={{ 
                                        color: '#888', 
                                        fontSize: '0.8rem', 
                                        margin: '-11px 0 0 0',
                                        fontStyle: 'italic' 
                                    }}>
                                        Email used for login can't be changed.
                                    </p>
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
                                    text="Save"
                                    type="submit"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}