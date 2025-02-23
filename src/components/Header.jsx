import React, { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "../util/hooks";
import logo from "../images/white_logo.jpg";
import { createFocusTrap } from "focus-trap";
import { DrawerLoginButton, LoginButton } from "./util/Buttons";
import { NavLink } from "react-router-dom";

const options = {
    "Cues & Accessories": [
        { text: "Pool Cues", link: "/collections/available" },
        { text: "Accessories", link: "/collections/available" },
        { text: "View All", link: "/collections/available" }
    ],
    "Materials": [
        { text: "Woods", link: "/collections/materials" },
        { text: "Crystals", link: "/collections/materials" },
        { text: "View All", link: "/collections/materials" }
    ]
};

const navItems = [
    { text: "Cues & Accessories", options: options["Cues & Accessories"] },
    { text: "Coming Soon", link: "/collections/coming-soon" },
    { text: "Build-A-Que", link: "/build-a-que" },
    { text: "Materials", options: options["Materials"] }
];

export default function Header() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [focusTrap, setFocusTrap] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const headerRef = useRef(null);

    const handleDropdown = (item) => {
        if (openDropdown === item) {
            setOpenDropdown(null);
        } else if (openDropdown) {
            setOpenDropdown(null);
            setTimeout(() => {
                setOpenDropdown(item);
            }, 300);
        } else {
            setOpenDropdown(item);
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && openDrawer) {
                setOpenDrawer(false);
                focusTrap && focusTrap.deactivate();
            }
        };

        if (openDrawer && screenWidth <= 990) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        if (openDrawer && screenWidth <= 990) {
            const trap = createFocusTrap('.main-header', {
                onActivate: () => document.body.classList.add('trap-is-active'),
                onDeactivate: () => document.body.classList.remove('trap-is-active'),
                initialFocus: '.header-drawer',
                fallbackFocus: '.main-header',
                escapeDeactivates: true,
                clickOutsideDeactivates: true
            });
            trap.activate();
            setFocusTrap(trap);

            // Add keydown event listener
            document.addEventListener('keydown', handleKeyDown);
        } else {
            if (focusTrap) {
                focusTrap.deactivate();
            }
            document.removeEventListener('keydown', handleKeyDown);
        }

        // Cleanup function to deactivate focus trap and remove event listener
        return () => {
            if (focusTrap) {
                focusTrap.deactivate();
            }
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [openDrawer, screenWidth]);

    useEffect(() => {
        const height = headerRef.current?.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
    }, [hasScrolled])

    useEffect(() => {
        const handleScroll = () => {
            const offset = 100;
            if (window.scrollY > offset) {
                setHasScrolled(true);
            } else if (window.scrollY === 0) {
                setHasScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLinkClick = () => {
        setOpenDrawer(false);
        setOpenDropdown(null);
    };

    return (
        <header className="main-header sticky" ref={headerRef}>
            {openDrawer && <div className="overlay header-overlay" />}
            {/* Drawer */}
            <div className="header-drawer">
                <button className={openDrawer ? "fa-solid fa-xmark header-icon" : "fa-solid fa-bars header-icon"} onClick={() => setOpenDrawer(!openDrawer)}/>

                {/* MENU DRAWER HERE*/}
                <div className={openDrawer ? "header-drawer-menu open" : "header-drawer-menu"}>
                    
                    {/* MENU DRAWER NAV*/}
                    <nav className="drawer-nav">
                        <ul className="list-menu">
                            {navItems.map((navItem) => {
                                const { text, link, options } = navItem;

                                return (
                                    <li key={text}>
                                        <DrawerNavItem text={text} link={link} options={options} isDropdown={!link && options} isOpen={openDropdown === text} onToggle={handleDropdown} openDropdown={openDropdown} onLinkClick={handleLinkClick}/>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    {/* MENU DRAWER FOOTER*/}
                    <div className={openDropdown ? "drawer-footer hidden" : "drawer-footer"}>
                        <DrawerLoginButton onClick={handleLinkClick} />
                        <div>
                            <button className="fa-brands fa-instagram header-icon" />
                            <button className="fa-brands fa-facebook header-icon" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Heading */}
            <h1 className="header-heading">
                <NavLink to="/" className={hasScrolled ? "scrolled-past" : "" } onClick={handleLinkClick}>
                    <img src={logo} className={hasScrolled ? "header-logo scrolled-past" : "header-logo" }/>
                </NavLink>
            </h1>

            {/* Nav Section w/ Dropdown Menu*/}
            <nav className="header-navigation">
                <ul className="header-list-menu list-menu">
                    {navItems.map((navItem) => {
                        const { text, link, options } = navItem;

                        return (
                            <li key={text}>
                                <HeaderNavItem text={text} link={link} options={options} isDropdown={!link && options} isOpen={openDropdown === text} onToggle={handleDropdown} onLinkClick={handleLinkClick}/>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Icons */}
            <div className="header-icons">
                <button className="fa-solid fa-magnifying-glass header-icon" />
                <LoginButton onClick={handleLinkClick} />
                <button className="fa-solid fa-cart-shopping header-icon" />
            </div>
        </header>
    );
}

function HeaderNavItem({text, isDropdown, isOpen, onToggle, options=false, link=false, onLinkClick}) {
    const ref = useRef(null); // Create a ref for the dropdown container

    // Use the custom hook to handle outside clicks
    useOutsideClick(ref, (e) => {
        if (!isOpen) return;

        if (e.target.id === "" && !(text !== e.target.id && e.target.id !== "")) {
            onToggle(text);
        }
    });

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onToggle(text);
        }
    };

    return (
        <div className="header-nav-item" ref={isDropdown ? ref : null}>
            <NavLink 
              onClick={isDropdown ? () => onToggle(text) : onLinkClick}
              onKeyDown={isDropdown ? handleKeyDown : undefined}
              tabIndex={0} 
              to={link}
              className={isOpen ? "main-nav-text open" : "main-nav-text"}
              id={text}
            >
                {text}
                {isDropdown && 
                    <button 
                      className={isOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} 
                      tabIndex={-1}
                      id={text}
                    />
                }
            </NavLink>
            
            {/* DROPDOWN MENU */}
            <div className={isOpen ? "dropdown-menu open" : "dropdown-menu"}>
                {/* Dropdown content goes here */}
                <ul className="header-list-sub-menu">
                    {options?.length && options.map((option) => {
                        const {text, link} = option;
                        
                        return (
                            <li key={text}>
                                <NavLink to={link} onClick={onLinkClick}>{text}</NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

function DrawerNavItem({ openDropdown, text, isDropdown, isOpen, onToggle, options = false, link = false, isLeft=false, onLinkClick }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onToggle(text);
        }
    };

    const allOptions = options?.length ? [{ text: text, onToggle: () => onToggle(text), isLeft: true }, ...options ] : options;

    return (
        <div className="drawer-nav-item">
            <NavLink
                onClick={isDropdown ? () => onToggle(text) : onLinkClick}
                onKeyDown={isDropdown ? handleKeyDown : undefined}
                tabIndex={0}
                to={link}
                id={text}
                className={isLeft ? "drawer-nav-text left" : openDropdown ? "drawer-nav-text hidden" : "drawer-nav-text"}
            >
                {isLeft ?
                <>
                    <button className="fa-solid fa-arrow-left" tabIndex={-1} />
                    {text}
                </>
                :
                <>
                    {text}
                    {!link && <button className="fa-solid fa-arrow-right" tabIndex={-1} />}
                </>
                }
                
            </NavLink>

            {/* SUB DRAWER MENU */}
            <div className={isOpen ? "header-drawer-menu open sub-menu" : "header-drawer-menu sub-menu"}>
                {/* MENU DRAWER NAV*/}
                <nav className="drawer-nav">
                    <ul className="list-menu">
                        {allOptions?.length && allOptions.map((navItem) => {
                            const { link, onToggle, isLeft } = navItem;
                            const subText = navItem.text;

                            return (
                                <li key={subText}>
                                    <DrawerNavItem text={subText} link={link} onToggle={() => onToggle(text)} isDropdown={true} isLeft={isLeft} onLinkClick={onLinkClick}/>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
