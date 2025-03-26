import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import AccountSection from "../../sections/AccountSection";
import { checkAuth, updateName } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";
import { FormField } from "../../util/Inputs";
import { useSelector } from "react-redux";

export default function ProfilePage() {
    const userData = useSelector(state => state.user);
    console.log(userData.email)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const openModal = () => {
        setIsModalOpen(true);
        reset({ firstName: userData.firstName || "", lastName: userData.lastName || "" });  
    };

    const onSubmit = async (data) => {
        try {
            const res = await updateName(userData.email, data.firstName, data.lastName);
            receiveResponse(res);

            if (res.status === "success") {
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log("Something went wrong.");
        }
    };

    return (
        <div className="user-content">
            <AccountSection title="Profile" onEdit={openModal}>
                <>
                    <div className="flex-h" style={{ alignItems: 'center', marginBottom: '1rem' }}>
                        <p style={{ 
                            color: '#888', 
                            margin: 0, 
                            minWidth: '60px' 
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
                            color: '#888', 
                            margin: 0, 
                            minWidth: '60px' 
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
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
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
                        <div className="flex-v" style={{ width: '100%' }}>
                            <div className="flex-h" style={{ width: '100%', gap: '1rem' }}>
                                <div className="flex-1">
                                    <FormField
                                        title="First Name"
                                        value={userData.firstName}
                                        {...register("firstName")}
                                    />
                                </div>
                                
                                <div className="flex-1">
                                    <FormField
                                        title="Last Name"
                                        value={userData.lastName}
                                        {...register("lastName")}
                                    />
                                </div>
                            </div>
                            <div className="flex-h" style={{ width: '100%', gap: '1rem' }}>
                                <div className="flex-1">
                                    <FormField
                                        title="Email"
                                        value={userData.email}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}