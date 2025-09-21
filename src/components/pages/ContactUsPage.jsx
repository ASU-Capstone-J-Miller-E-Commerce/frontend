import React, { useState, useEffect } from "react";
import { FormField, FormTextArea } from "../util/Inputs";
import { useForm } from "react-hook-form";
import { DefaultButton } from "../util/Buttons";
import { contactUs } from "../../util/requests";
import { receiveResponse } from "../../util/notifications";

export default function ContactUsPage() {
    const { register, handleSubmit, watch, formState: { errors }, reset, setFocus } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            comment: ""
        }
    });

    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setFocus("name"), 0);
        return () => clearTimeout(t);
    }, [setFocus]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAttachment(file);
    };

    const onSubmit = (data) => {
        const payload = {
            subject: data.subject,
            message: `
                    <b>Client Name:</b> ${data.name}<br>
                    <b>Client Email:</b> ${data.email}<br>
                    <b>Client Phone:</b> ${String(data.phone || '')}<br>
                    <b>Message:</b><br>${data.comment}
                    `
        };
        contactUs(payload)
            .then(response => {
                // reset form
                receiveResponse(response);
                reset();
                setAttachment(null);
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            })
    };

    const name = watch("name");
    const email = watch("email");
    const phone = watch("phone");
    const subject = watch("subject");
    const comment = watch("comment");

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Contact Us</h1>
            </div>
            
            <div className="page-content contact-content">
                <div className="contact-form-section">
                    <h2>Get In Touch</h2>
                    <p className="contact-description">
                        Have questions about our custom cues or need assistance with your order? 
                        We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                    
                    <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="contact-row">
                            <div className="form-column flex-1">
                                <FormField
                                    autoFocus
                                    type="text"
                                    title="Name*"
                                    value={name}
                                    error={errors.name && errors.name.message}
                                    {...register("name", {
                                        required: "Name is required"
                                    })}
                                />
                            </div>
                            <div className="form-column flex-1">
                                <FormField
                                    type="email"
                                    title="Email*"
                                    value={email}
                                    error={errors.email && errors.email.message}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Please enter a valid email address"
                                        }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="contact-row">
                            <div className="form-column flex-1">
                                <FormField
                                    type="tel"
                                    title="Phone"
                                    value={phone}
                                    error={errors.phone && errors.phone.message}
                                    {...register("phone")}
                                />
                            </div>
                            <div className="form-column flex-1">
                                <FormField
                                    type="text"
                                    title="Subject"
                                    value={subject}
                                    error={errors.subject && errors.subject.message}
                                    {...register("subject")}
                                />
                            </div>
                        </div>

                        <FormTextArea
                            title="Message*"
                            value={comment}
                            error={errors.comment && errors.comment.message}
                            {...register("comment", {
                                required: "Message is required"
                            })}
                        />

                        <div className="file-upload-section">
                            <label className="file-upload-label">
                                <i className="fa-solid fa-paperclip"></i>
                                Attachment (Optional)
                            </label>
                            <input
                                type="file"
                                name="attachment"
                                onChange={handleFileChange}
                                className="file-upload-input"
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            />
                            {attachment && (
                                <p className="file-selected">
                                    Selected: {attachment.name}
                                </p>
                            )}
                            <p className="file-upload-help">
                                Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)
                            </p>
                        </div>

                        <DefaultButton text="Send Message" type="submit" />
                    </form>
                </div>

                <div className="contact-info-section">
                    <h2>Contact Information</h2>
                    
                    <div className="contact-info-grid">
                        <div className="contact-info-item">
                            <div className="contact-icon">
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <div className="contact-details">
                                <h4>Phone</h4>
                                <p>(555) 123-4567</p>
                                <p className="contact-note">Mon-Fri, 9AM-6PM EST</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <div className="contact-details">
                                <h4>Email</h4>
                                <p>info@jmillercues.com</p>
                                <p className="contact-note">We respond within 24 hours</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <div className="contact-details">
                                <h4>Address</h4>
                                <p>1234 Craftsman Lane</p>
                                <p>Woodworker City, WC 12345</p>
                                <p>United States</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="contact-icon">
                                <i className="fa-solid fa-clock"></i>
                            </div>
                            <div className="contact-details">
                                <h4>Business Hours</h4>
                                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}