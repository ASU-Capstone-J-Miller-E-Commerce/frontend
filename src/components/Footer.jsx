import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/white_logo.jpg";
import { SOCIAL_MEDIA_LINKS } from "../util/globalConstants";

const navigationLinks = [
    { text: "About Us", link: "/pages/about-us" },
    { text: "References", link: "/pages/references" },
    { text: "FAQ", link: "/pages/faq" },
    { text: "Contact Us", link: "/pages/contact-us" }
];

export default function Footer () {
    const footerRef = useRef(null);

    useEffect(() => {
        const height = footerRef.current?.offsetHeight;
        document.documentElement.style.setProperty('--footer-height', `${height}px`);
    }, []);

    return (
        <footer className="main-footer" ref={footerRef}>
            {/* Main footer content - gray background */}
            <div className="footer-content">
                {/* Company Logo and Contact Info */}
                <div className="footer-logo">
                    <NavLink to="/">
                        <img src={logo} alt="J Miller Custom Cues" className="footer-logo-img" />
                    </NavLink>
                    <div className="footer-contact-info">
                        <p>1234 Hwy 456</p>
                        <p>Mesa, AZ 85213</p>
                        <p>1-800-123-4567</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="footer-navigation">
                    <ul className="footer-nav-list">
                        {navigationLinks.map((navItem) => (
                            <li key={navItem.text}>
                                <NavLink to={navItem.link} className="main-nav-text">
                                    {navItem.text}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Social Media Icons */}
                <div className="footer-social">
                    {SOCIAL_MEDIA_LINKS.map((social) => (
                        <a 
                            key={social.name}
                            href={social.url}
                            className={`footer-social-link ${social.icon}`}
                            aria-label={social.name}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ))}
                </div>
            </div>

            {/* White separator line */}
            <div className="footer-separator"></div>

            {/* Copyright section - black background */}
            <div className="footer-copyright">
                <p>&copy; 2025, J Miller Custom Cues</p>
            </div>
        </footer>
    );
}
