import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

/*==============================================================
# Defaults
==============================================================*/
export function DefaultButton({text, onClick, disabled, className}) {
    const [ripples, setRipples] = useState([]);

    const createRipple = (event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const initialSize = size * 0.8;
        const x = event.clientX - rect.left - initialSize / 2;
        const y = event.clientY - rect.top - initialSize / 2;
        const newRipple = {
            id: Math.random(),
            style: {
                top: `${y}px`,
                left: `${x}px`,
                width: `${initialSize}px`,
                height: `${initialSize}px`,
                position: 'absolute',
                background: 'rgba(255, 255, 255, 0.31)',
                borderRadius: '50%',
                transform: 'scale(0)',
                transition: 'transform 0.5s, opacity 0.6s',
                opacity: 1,
            }
        };

        setRipples([...ripples, newRipple]);

        setTimeout(() => {
            setRipples(currentRipples =>
                currentRipples.map(ripple =>
                    ripple.id === newRipple.id ? { ...ripple, style: { ...ripple.style, transform: 'scale(3)', opacity: 0.01 } } : ripple
                )
            );
        }, 50);

        setTimeout(() => {
            setRipples(currentRipples => currentRipples.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
    };

    const handleClick = (e) => {
        createRipple(e)
        onClick && onClick(e);
    };

    return (
        <button className={`default-button ${className}`} onClick={handleClick} disabled={disabled}>
            {text}
            {ripples.map(ripple => (
                <span key={ripple.id} className="ripple" style={ripple.style}></span>
            ))}
        </button>
    );
}


/*==============================================================
# Login
==============================================================*/
export function LoginButton({onClick}) {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => !!state.user?.authenticated);

    return (
        <button
            className="fa-solid fa-user header-icon"
            onClick={() => {
                onClick && onClick();
                navigate(isAuthenticated ? '/account/profile' : '/login');
            }}
        >
        </button>
    );
}

export function DrawerLoginButton({onClick}) {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => !!state.user?.authenticated);

    return (
        <NavLink 
            className="drawer-foot-nav-text" 
            tabIndex={0} 
            to={isAuthenticated ? '/account/profile' : '/login'}
            onClick={(e) => {
                onClick && onClick();
            }}
        >
            <button 
                className="fa-solid fa-user drawer-login-icon" 
                tabIndex={-1} 
                onClick={(e) => e.stopPropagation()}
            />
            {isAuthenticated ? 'My Account' : 'Log In'}
        </NavLink>
    );
}

/*==============================================================
# Cart
==============================================================*/
export function CartButton({onClick}) {
    const navigate = useNavigate();
    const totalItems = useSelector(state => state.cart?.totalItems || 0);

    const handleClick = () => {
        onClick && onClick();
        navigate('/cart');
    };

    return (
        <div 
            className="cart-button-container" 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-label={`Shopping cart with ${totalItems} items`}
        >
            <i className="fa-solid fa-cart-shopping cart-icon header-icon" />
            {totalItems > 0 && (
                <div className="cart-count-badge">
                    <span className="cart-count-text">
                        {totalItems > 99 ? '99+' : totalItems}
                    </span>
                </div>
            )}
        </div>
    );
}