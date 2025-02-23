import React, { useRef, useEffect } from "react";

export default function Footer () {
    const footerRef = useRef(null);

    useEffect(() => {
        const height = footerRef.current?.offsetHeight;
        document.documentElement.style.setProperty('--footer-height', `${height}px`);
    }, []);

    return (
        <footer className="main-footer" ref={footerRef}>
            <div>Logo</div>
            <div>Navigation</div>
            <div>Contact Info</div>
        </footer>
    );
}
