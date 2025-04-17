import React, { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "../util/hooks";
import logo from "../images/white_logo.jpg";
import { createFocusTrap } from "focus-trap";
import { DrawerLoginButton, LoginButton } from "./util/Buttons";
import { NavLink, useLocation } from "react-router-dom";
import { searchSite } from '../util/requests';
import { motion, AnimatePresence } from "framer-motion";

const options = {
    "Materials": [
        { text: "Woods", link: "/collections/materials?wood=true" },
        { text: "Stones and Crystals", link: "/collections/materials?crystal=true" },
        { text: "View All Materials", link: "/collections/materials" }
    ],
    "Cues": [
        { text: "Available Cues", link: "/collections/cues?available=true" },
        { text: "Upcoming Cues", link: "/collections/cues?upcoming=true" },
        { text: "Sold Cues", link: "/collections/cues?sold=true" },
        { text: "View All Cues", link: "/collections/cues" },
    ]
};

const navItems = [
    { text: "Cues", options: options["Cues"] },
    { text: "Accessories", link: "/collections/accessories" },
    { text: "Build-A-Cue", link: "/build-a-cue" },
    { text: "Materials", options: options["Materials"] }
];

export default function Header() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [focusTrap, setFocusTrap] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const headerRef = useRef(null);
    const location = useLocation();
    
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
    }, [hasScrolled, screenWidth]);

    useEffect(() => {
        const handleScroll = () => {
            const offset = 100;
            if (location.pathname.startsWith('/account')) {
                setHasScrolled(true);
            } else if (window.scrollY > offset) {
                setHasScrolled(true);
            } else if (window.scrollY === 0) {
                setHasScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (location.pathname.startsWith('/account')) {
            setHasScrolled(true);
        } else {
            setHasScrolled(false);
        }
    }, [location.pathname]);

    const handleLinkClick = () => {
        setOpenDrawer(false);
        setOpenDropdown(null);
    };

    const handleSearch = (value) => {
        if (value.trim() !== "") {
            setIsLoading(true);
            console.log("Searching for:", value);
            searchSite(value)
            .then((res) => {
                setSearchResults(res.data)
                setIsLoading(false);
            })
            .catch((err) => {

            })
        }
        else
        {
            setSearchResults([]);
        }
    };
    
    const hideSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowSearch(false);
    }

    return (
        <>
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
            <div className="header-heading">
                <NavLink to="/" className={hasScrolled ? "scrolled-past" : "" } onClick={handleLinkClick}>
                    <img src={logo} className={hasScrolled ? "header-logo scrolled-past" : "header-logo" }/>
                </NavLink>
            </div>

            {/* Nav Section w/ Dropdown Menu*/}
            {showSearch ? (
                <div className="header-search-container">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="header-search-input"
                        value={searchQuery}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            handleSearch(value);
                        }}
                        autoFocus
                    />
                    <button 
                        className="fa-solid fa-xmark header-icon" 
                        onClick={() => hideSearch()}
                    />
                </div>
                
            ) : (
                <>
                    <nav className="header-navigation">
                        <ul className="header-list-menu list-menu">
                            {navItems.map((navItem) => {
                                const { text, link, options } = navItem;

                                return (
                                    <li key={text}>
                                        <HeaderNavItem 
                                            text={text} 
                                            link={link} 
                                            options={options} 
                                            isDropdown={!link && options} 
                                            isOpen={openDropdown === text} 
                                            onToggle={handleDropdown} 
                                            onLinkClick={handleLinkClick}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="header-icons">
                        <button 
                            className="fa-solid fa-magnifying-glass header-icon" 
                            onClick={() => setShowSearch(true)}
                        />
                        <LoginButton onClick={handleLinkClick} />
                        <button className="fa-solid fa-cart-shopping header-icon" />
                    </div>
                </>
            )}
        </header>
        <AnimatePresence>
        {showSearch && (isLoading || searchResults.length > 0) && (
            <motion.div
            className="search-results-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 0.5
            }}
            >
            {isLoading ? (
                <div className="loading-message">Loading...</div>
            ) : searchResults.length > 0 ? (
                <>
                <div className="results-grid">
                    {searchResults.slice(0, 4).map((item) => (
                    <a href={item.guid} key={item.guid} className="result-card">
                        <div className="result-image-container">
                            <img className="result-image" src={item.imageUrls[0]} />
                        </div>
                        <div className="result-text-container">
                            <h3 className="result-item">{item.crystalName ? (`Crystal`) : (item.accessoryNumber ? (`Accessory`) : (item.commonName ? (`Wood`) : (`Cue`)))}</h3>
                            <h3 className="result-title">{item.name ? (item.name) : (item.commonName ? (item.commonName) : (item.crystalName))}</h3>
                            <p className="result-description">{item.description ? (item.description.length > 20 ? (item.description.slice(0, 20) + `...`) : (item.description)) : (item.crystalCategory)}</p>
                            <p className="result-price">{item.price ? (`$` + Number(item.price).toFixed(2)) : (null)}</p>
                        </div>
                    </a>
                    ))}
                </div>
                {searchResults.length > 4 && (
                    <div className="view-all-container">
                    <button
                        className="view-all-button"
                        onClick={() => setShowAllResults(true)}
                    >
                        View All
                    </button>
                    </div>
                )}
                </>
            ) : null}
            </motion.div>
        )}
        </AnimatePresence>

        </>
    );
}

function HeaderNavItem({text, isDropdown, isOpen, onToggle, options=false, link=false, onLinkClick}) {
    const ref = useRef(null);

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
            {isDropdown ? (
                <div 
                    onClick={() => onToggle(text)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    className={isOpen ? "main-nav-text open" : "main-nav-text"}
                    id={text}
                    role="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    {text}
                    <span 
                        className={isOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} 
                        aria-hidden="true"
                        id={text}
                    />
                </div>
            ) : (
                <NavLink 
                    onClick={onLinkClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={0} 
                    to={link}
                    className="main-nav-text"
                    id={text}
                    style={{ display: 'flex', alignItems: 'center', height: '100%' }}
                >
                    {text}
                </NavLink>
            )}
            
            {/* DROPDOWN MENU */}
            <div className={isOpen ? "dropdown-menu open" : "dropdown-menu"}>
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
