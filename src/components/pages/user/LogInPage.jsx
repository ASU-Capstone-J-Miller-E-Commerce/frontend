import React from "react";
import { FormField } from "../../util/Inputs";
import { useForm } from "react-hook-form";
import { Button } from "../../util/Buttons";
import { NavLink } from "react-router-dom";

export default function LoginPage () {
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
                    Login
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
                        <Button text="Sign in"/>
                        <div>
                            <span className="form-action-row">
                                New customer? <NavLink to="/account/create-account">Create account</NavLink>
                            </span>
                            <span className="form-action-row">
                                <NavLink to="/account/password-reset">Forgot your password?</NavLink>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}