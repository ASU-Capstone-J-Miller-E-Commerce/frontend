import React, { useState, useEffect } from "react";
import { FormField, FormSelect } from "../util/Inputs";
import { useForm } from "react-hook-form";
import { DefaultButton } from "../util/Buttons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createCheckoutSession } from "../../util/requests";
import { receiveResponse } from "../../util/notifications";
import countryList from "react-select-country-list";

export default function ShippingPage() {
    const navigate = useNavigate();
    const cartItems = useSelector(state => state.cart.items);
    const user = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    
    const { register, handleSubmit, watch, formState: { errors }, setFocus } = useForm({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        }
    });

    useEffect(() => {
        // Redirect if cart is empty
        if (cartItems.length === 0) {
            navigate("/cart");
            return;
        }
        
        const t = setTimeout(() => setFocus("firstName"), 0);
        return () => clearTimeout(t);
    }, [setFocus, cartItems.length, navigate]);

    // Get country options using react-select-country-list
    const countryOptions = countryList().getData().map(country => ({
        label: country.label,
        value: country.value // This gives us the 2-letter country code (e.g., "US", "CA", "GB")
    }));

    const watchedValues = watch();

    const onSubmit = (data) => {
        setLoading(true);
        
        // Call the existing checkout function but with shipping data
        const shippingData = {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country
        };
        
        createCheckoutSession(cartItems, data.email, shippingData)
            .then((response) => {
                receiveResponse(response);
                
                if (response && response.data) {
                    // Redirect to Stripe checkout page
                    window.location.href = response.data;
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    const hasItemsWithoutPrice = () => {
        return cartItems.some(item => !item.itemDetails.price || item.itemDetails.price === "" || item.itemDetails.price === null);
    };

    // If there are items without pricing, redirect to contact
    if (hasItemsWithoutPrice()) {
        return (
            <section className="form-content">
                <div className="login-area">
                    <h1 className="login-page-title">Shipping Information</h1>
                    <p className="login-page-subtitle">
                        Your cart contains items that require custom pricing. Please contact us for a quote.
                    </p>
                    <DefaultButton 
                        text="Contact for Pricing" 
                        onClick={() => navigate("/pages/contact-us")}
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="form-content">
            <div className="login-area">
                <h1 className="login-page-title">Shipping Information</h1>
                <p className="login-page-subtitle">
                    Please provide your shipping details to continue to checkout.
                </p>

                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                    {/* Contact Information */}
                    <div className="form-row">
                        <div className="form-column">
                            <FormField 
                                autoFocus
                                title="First Name"
                                type="text"
                                value={watchedValues.firstName}
                                error={errors.firstName && errors.firstName.message}
                                {...register("firstName", {
                                    required: "First name is required",
                                })} 
                            />
                        </div>
                        <div className="form-column">
                            <FormField 
                                title="Last Name"
                                type="text"
                                value={watchedValues.lastName}
                                error={errors.lastName && errors.lastName.message}
                                {...register("lastName", {
                                    required: "Last name is required",
                                })} 
                            />
                        </div>
                    </div>

                    <FormField 
                        title="Email"
                        type="email"
                        value={watchedValues.email}
                        error={errors.email && errors.email.message}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Please enter a valid email address"
                            }
                        })} 
                    />

                    {/* Shipping Address */}
                    <FormField 
                        title="Street Address"
                        type="text"
                        value={watchedValues.address}
                        error={errors.address && errors.address.message}
                        {...register("address", {
                            required: "Street address is required",
                        })} 
                    />

                    <div className="form-row">
                        <div className="form-column">
                            <FormField 
                                title="City"
                                type="text"
                                value={watchedValues.city}
                                error={errors.city && errors.city.message}
                                {...register("city", {
                                    required: "City is required",
                                })} 
                            />
                        </div>
                        <div className="form-column">
                            <FormField 
                                title="State / Province"
                                type="text"
                                value={watchedValues.state}
                                error={errors.state && errors.state.message}
                                {...register("state", {
                                    required: "State/Province is required",
                                })} 
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-column">
                            <FormField 
                                title="Postal Code"
                                type="text"
                                value={watchedValues.postalCode}
                                error={errors.postalCode && errors.postalCode.message}
                                {...register("postalCode", {
                                    required: "Postal code is required",
                                })} 
                            />
                        </div>
                        <div className="form-column">
                            <FormSelect
                                title="Country"
                                value={watchedValues.country}
                                error={errors.country && errors.country.message}
                                options={countryOptions}
                                displayKey="label"
                                valueKey="value"
                                {...register("country", {
                                    required: "Please select a country",
                                })}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="login-actions">
                        <DefaultButton 
                            text={loading ? "Processing..." : "Continue to Payment"}
                            type="submit"
                            disabled={loading}
                        />
                        <div>
                            <span className="form-action-row">
                                <button 
                                    type="button"
                                    className="form-link-button"
                                    onClick={() => navigate("/cart")}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: 'inherit', 
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        padding: 0,
                                        font: 'inherit'
                                    }}
                                >
                                    ← Return to Cart
                                </button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}