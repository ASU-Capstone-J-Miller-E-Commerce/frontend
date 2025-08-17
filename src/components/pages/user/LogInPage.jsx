import React, { useState, useEffect } from "react";
import { FormField } from "../../util/Inputs";
import { useForm } from "react-hook-form";
import { DefaultButton } from "../../util/Buttons";
import { NavLink, useNavigate } from "react-router-dom";
import { login, test, verify2FALogin } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";
import { checkUserAuth } from "../../../util/functions";
import { Dialog, DialogTitle, DialogContent, useForkRef } from "@mui/material";

export default function LoginPage () {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors }, setFocus: setLoginFocus } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const { register: verRegister, handleSubmit: verHandleSubmit, watch: verWatch, formState: { errors: verErrors }, reset: verReset, setFocus: setVerifyFocus } = useForm({
        defaultValues: {
            verCode: "",
        }
    });

    useEffect(() => {
        const t = setTimeout(() => setLoginFocus("email"), 0);
        return () => clearTimeout(t);
    }, [setLoginFocus]);

    //2FA Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tempToken, setTempToken] = useState(null);
    const [iv, setIV] = useState(null);

    const handleCloseDialog = () => {
        setIsModalOpen(false);
        verReset({ verCode: "" });
    };

    const onSubmit = data => {
        login(data.email, data.password)
            .then((res) => {
                receiveResponse(res);

                if(res.data[0] === true)
                {
                    setTempToken(res.data[1]);
                    setIV(res.data[2]);
                    setIsModalOpen(true);
                }
                else{
                    checkUserAuth();
                    navigate("/");
                }
            });
    };

    const handle2FAVerify = data => {
        setLoading(true);
        verify2FALogin(tempToken, data.verCode, iv)
            .then((res) => {
                receiveResponse(res);
                setIsModalOpen(false);
                setLoading(false);
                setTempToken(null);
                checkUserAuth();
                navigate("/");
            })
            .catch((err) => 
            {
                receiveResponse(err);
                setLoading(false);
            });
};

    const email = watch("email");
    const password = watch("password");
    const verCode = verWatch("verCode");

    return (
        <section className="form-content">
            <div className="login-area">
                {/* HEADER */}
                <h1 className="login-page-title">
                    Login
                </h1>

                {/* FIELDS */}
                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <FormField 
                        autoFocus
                        title="Email"
                        type="text"
                        value={email}
                        error={errors.email && errors.email.message}
                        {...register("email", {
                            required: "Email is required",
                        })} 
                    />

                    <FormField 
                        title="Password"
                        type="password"
                        value={password}
                        error={errors.password && errors.password.message}
                        {...register("password", {
                            required: "Password is required",
                        })} 
                    />

                    {/* ACTIONS */}
                    <div className="login-actions">
                        <DefaultButton text="Sign in"/>
                        <div>
                            <span className="form-action-row">
                                New customer? <NavLink to="/create-account">Create account</NavLink>
                            </span>
                            <span className="form-action-row">
                                <NavLink to="/password-reset">Forgot your password?</NavLink>
                            </span>
                        </div>
                    </div>

                </form>


                 {/* Modal */}
                <Dialog 
                    open={isModalOpen} 
                    onClose={handleCloseDialog} 
                    fullWidth 
                    maxWidth="sm" 
                    className="miller-dialog-typography"
                    PaperProps={{ className: "miller-dialog-typography" }}
                    TransitionProps={{ onEntered: () => setVerifyFocus("verCode") }}
                >
                    <DialogTitle>
                        Enter Your Authentication Code :

                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={verHandleSubmit(handle2FAVerify)}>
                            <div className="form-column" style={{ width: '100%' }}>
                                        <FormField
                                            title="Code"
                                            type="password"
                                            value={verCode}
                                            error={verErrors.verCode && verErrors.verCode?.message}
                                            {...verRegister("verCode", { 
                                                required: "Verification code is required.",
                                                pattern: {
                                                    value: /^\d+$/,
                                                    message: "Code must contain only digits."
                                                }
                                            })}
                                        />

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
                                        text="Verify Code"
                                        type="submit"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>

            

        </section>
    );
}