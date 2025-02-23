import React from "react";
import { FormField } from "../../util/Inputs";
import { useForm } from "react-hook-form";
import { Button } from "../../util/Buttons";
import { NavLink } from "react-router-dom";

export default function CreateAccountPage () {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = data => {
        console.log(data);
    };

    const email = watch("email");
    const password = watch("password");

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
                        onChange={(e) => console.log(e.target.value)}
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

                    {/* ACTIONS */}
                    <div className="login-actions">
                        <Button text="Create"/>
                        <div>
                            <span className="form-action-row">
                                Returning customer? <NavLink to="/account/login">Sign in</NavLink>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}