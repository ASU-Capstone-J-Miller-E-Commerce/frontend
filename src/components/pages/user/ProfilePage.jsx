import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AccountSection from "../../sections/AccountSection";
import { checkAuth, updateName } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";
import { FormField } from "../../util/Inputs";
import { useSelector } from "react-redux";

export default function ProfilePage() {
    const userData = useSelector(state => state.user);
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
                const res = await checkAuth();
                receiveResponse(res);
                
                if (res.status === "success" && res.data.authenticated) {
                    setUserData(res.data);
                }
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

            {/* Popup Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Name</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormField
                                title="First Name"
                                value={userData.firstName}
                                error={errors.firstName && errors.name.firstName.message}
                                {...register("firstName")}
                            />

                            <FormField
                                title="Last Name"
                                value={userData.lastName}
                                error={errors.lastName && errors.lastName.message}
                                {...register("lastName")}
                            />

                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}