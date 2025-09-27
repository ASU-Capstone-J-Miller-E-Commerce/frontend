import React from "react";
import { FormField } from "../../util/Inputs";
import { useForm } from "react-hook-form";
import { DefaultButton } from "../../util/Buttons";
import { NavLink } from "react-router-dom";
import { emailResetPassword } from "../../../util/requests";
import { receiveResponse } from "../../../util/notifications";

export default function PasswordReset () {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = data => {
        emailResetPassword(data.email)
            .then(response => {
                // reset form
                receiveResponse(response);
                reset();
        });
    };

    const email = watch("email");

    return (
        <section className="form-content">
            <div className="login-area">
                {/* HEADER */}
                <h1 className="login-page-title">
                    Reset your password
                </h1>

                <p className="login-page-subtitle">
                    We will send you an email to reset your password.
                </p>

                {/* FIELDS */}
                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    <FormField 
                        title="Email"
                        type="text"
                        value={email}
                        error={errors.email && errors.email.message}
                        {...register("email", {
                            required: "Email is required",
                        })} 
                    />

                    {/* ACTIONS */}
                    <div className="login-actions">
                        <DefaultButton text="Submit"/>
                        <div>
                            <span className="form-action-row">
                                Remember your password? <NavLink to="/login">Sign in</NavLink>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}