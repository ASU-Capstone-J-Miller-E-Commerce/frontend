import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AccountSection from "../../sections/AccountSection";
import { checkAuth, updateName } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await checkAuth();
                receiveResponse(res);
                
                if (res.status === "success" && res.data.authenticated) {
                    setUserData(res.data);
                }
            } catch (error) {
                console.log("Something went wrong.");
            }
        };

        fetchUserData();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
        reset({ firstName: "", lastName: "" });  
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
                {userData ? (
                    <>
                        <div className="flex-h" style={{ alignItems: 'center', marginBottom: '1rem' }}>
                            <p style={{ 
                                color: '#444', 
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
                                color: '#444', 
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
                ) : (
                    <p>Loading...</p>
                )}
            </AccountSection>

            {/* Popup Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Name</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label>First Name:</label>
                            <input 
                                type="text" 
                                {...register("firstName")} 
                            />
                            {errors.firstName && <p className="error">{errors.firstName.message}</p>}

                            <label>Last Name:</label>
                            <input 
                                type="text" 
                                {...register("lastName")} 
                            />
                            {errors.lastName && <p className="error">{errors.lastName.message}</p>}

                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}