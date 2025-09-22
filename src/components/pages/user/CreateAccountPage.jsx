import React from "react";
import { FormField } from "../../util/Inputs";
import { useForm } from "react-hook-form";
import { DefaultButton } from "../../util/Buttons";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";

export default function CreateAccountPage () {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            emailNotos: true
        }
    });

    const onSubmit = data => {
        registerUser(data.email, data.password, data.firstName, data.lastName, data.emailNotos)
            .then((res) => {
                receiveResponse(res);
                navigate("/login");
            });
    };

    const email = watch("email");
    const password = watch("password");
    const firstName = watch("firstName");
    const lastName = watch("lastName");
    const emailNotos = watch("emailNotos");

    return (
        <section className="form-content">
            <div className="login-area">
                {/* HEADER */}
                <h1 className="login-page-title">
                    Create account
                </h1>

                {/* FIELDS */}
                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <FormField 
                        title="Email"
                        type="text"
                        value={email}
                        error={errors.email && errors.email.message}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            },
                            maxLength: {
                                value: 320,
                                message: "Email must be at most 320 characters long"
                            }
                        })}
                    />

                    <div className="form-row">
                        <div className="flex-1">
                            <FormField
                                title="First Name"
                                type="text"
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
                                type="text"
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

                    <FormField 
                        title="Password"
                        type="password"
                        value={password}
                        error={errors.password && errors.password.message}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long"
                            },
                            maxLength: {
                                value: 64,
                                message: "Password must be at most 64 characters long"
                            }
                        })}
                    />

                    {/* Promotional Email Opt-in Checkbox */}
                    <div className="form-row email-notos-row">
                        <label htmlFor="emailNotos" className="email-notos-label">
                            <input
                                id="emailNotos"
                                type="checkbox"
                                className="email-notos-checkbox"
                                {...register("emailNotos")}
                                checked={!!emailNotos}
                            />
                            <span className="email-notos-text">I want to receive promotional emails and offers</span>
                        </label>
                    </div>

                    {/* ACTIONS */}
                    <div className="login-actions">
                        <DefaultButton text="Create"/>
                        <div>
                            <span className="form-action-row">
                                Returning customer? <NavLink to="/login">Sign in</NavLink>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}