import React, { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "../util/hooks";
import logo from "../images/white_logo.jpg";
import { createFocusTrap } from "focus-trap";
import { DrawerLoginButton, LoginButton } from "./util/Buttons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Dialog, IconButton, InputBase, Box, Typography } from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { searchSite } from "../util/requests";
import { Card } from "./util/Card"; // Import the Card component

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
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [searchOpen, setSearchOpen] = useState(false);
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

    const handleSearchOpen = () => {
        setSearchOpen(true);
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
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
            <div className="header-heading">
                <NavLink to="/" className={hasScrolled ? "scrolled-past" : "" } onClick={handleLinkClick}>
                    <img src={logo} className={hasScrolled ? "header-logo scrolled-past" : "header-logo" }/>
                </NavLink>
            </div>

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
                <button 
                    className="fa-solid fa-magnifying-glass header-icon" 
                    onClick={handleSearchOpen}
                    aria-label="Search"
                />
                <LoginButton onClick={handleLinkClick} />
                <button className="fa-solid fa-cart-shopping header-icon" />
            </div>

            <SearchDialog 
                open={searchOpen} 
                onClose={handleSearchClose} 
                hasScrolled={hasScrolled} 
            />
        </header>
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

function SearchDialog({ open, onClose, hasScrolled }) {
    const [searchResults, setSearchResults] = useState([]);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [nothingFound, setNothingFound] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    
    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setSearchResults([]);
            setHasMoreResults(false);
            setNothingFound(false);
            setSearchQuery('');
            if (searchInputRef.current) {
                searchInputRef.current.value = '';
            }
        }
    }, [open]);
    
    useEffect(() => {
        if (open && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [open]);
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            onClose();
        }
    };

    const handleSearchInput = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length === 0) {
            setSearchResults([]);
            setHasMoreResults(false);
            setNothingFound(false);
            return;
        }

        searchSite(query)
            .then((response) => {
                const { items, hasMoreResults } = response.data;
                setSearchResults(items);
                setHasMoreResults(hasMoreResults);
                setNothingFound(items.length === 0);
            });
    }
    
    // Helper function to get appropriate display name and link
    const getItemDetails = (item) => {
        let name = '';
        let link = '';
        
        if (item.name) {
            name = item.name;
            if (item.cueNumber) link = `/cues/${item._id}`;
            else if (item.accessoryNumber) link = `/accessories/${item._id}`;
        } else if (item.commonName) {
            name = item.commonName;
            link = `/materials/${item._id}`;
        } else if (item.crystalName) {
            name = item.crystalName;
            link = `/materials/${item._id}`;
        }
        
        return { name, link };
    };
    
    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    position: 'absolute',
                    top: 0,
                    margin: 0,
                    width: '100%', 
                    maxWidth: '100%',
                    borderRadius: 0,
                    bgcolor: 'black',
                    color: 'white',
                    boxShadow: 'none',
                    // Height handling for search results
                    height: searchResults.length > 0 || nothingFound ? 'auto' : (hasScrolled ? '70px' : '100px'),
                    minHeight: hasScrolled ? '70px' : '100px',
                    // Use 95vh to take up almost the entire viewport while leaving a small margin
                    maxHeight: searchResults.length > 0 || nothingFound ? '100vh' : 'auto',
                    // Always maintain scroll capability
                    overflowY: searchResults.length > 0 || nothingFound ? 'auto' : 'hidden',
                    overflowX: 'hidden', // Prevent horizontal scrolling
                    // Smooth transition for size changes
                    transition: 'all 0.3s ease'
                }
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }
            }}
        >
            <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto',
                    padding: {
                        xs: '0 10px', // Smaller padding on mobile
                        sm: '0 150px', // Medium padding on tablets
                        md: '0 300px'  // Larger padding on desktop
                    },
                    width: '100%',
                    boxSizing: 'border-box', // Ensure padding is included in width calculation
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        padding: '5px 15px', // Increased horizontal padding from 10px to 15px
                        width: '100%',
                        margin: '15px 0',
                        boxSizing: 'border-box' // Ensure padding is included in width calculation
                    }}
                >
                    <Search sx={{ color: 'black', marginRight: 1 }} />
                    <InputBase
                        placeholder="Search..."
                        inputRef={searchInputRef}
                        fullWidth
                        onChange={handleSearchInput}
                        sx={{
                            color: 'black',
                            '& .MuiInputBase-input': {
                                fontSize: '1.2rem',
                            }
                        }}
                    />
                    <IconButton 
                        onClick={onClose} 
                        sx={{ color: 'black' }}
                        aria-label="Close search"
                    >
                        <Close />
                    </IconButton>
                </Box>
                
                {/* Search Results Grid */}
                {searchResults.length > 0 && (
                    <Box
                        sx={{
                            padding: '0 0 20px 0',
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            color: 'black',
                            boxSizing: 'border-box', // Ensure padding is included in width calculation
                            overflow: 'hidden' // Prevent content from spilling out
                        }}
                    >
                        <Box
                            className="search-results-grid"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, 1fr)',  // 2 per row on mobile
                                    sm: 'repeat(3, 1fr)',  // 3 per row on tablets
                                    md: 'repeat(4, 1fr)'   // 4 per row on desktop
                                },
                                gap: '15px',
                                padding: '20px 15px', // Increased padding from 15px to 20px top/bottom and 25px left/right
                                boxSizing: 'border-box' // Ensure padding is included in width calculation
                            }}
                        >
                            {searchResults.map((item, index) => {
                                const { name, link } = getItemDetails(item);
                                return (
                                    <Card 
                                        key={index}
                                        title={name}
                                        image={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '/placeholder.png'}
                                        tag={item.cueNumber || item.accessoryNumber || ''}
                                        price={item.price}
                                        linkTo={link}
                                    />
                                );
                            })}
                        </Box>
                        
                        {hasMoreResults && (
                            <Box sx={{ textAlign: 'center', padding: '10px', borderTop: '1px solid #eee' }}>
                                <Typography 
                                    component={NavLink} 
                                    to={`/search?query=${encodeURIComponent(searchQuery)}`}
                                    onClick={onClose}
                                    sx={{ 
                                        color: 'inherit', 
                                        textDecoration: 'underline',
                                        '&:hover': { color: '#666' }
                                    }}
                                >
                                    View all results
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
                
                {nothingFound && (
                    <Box
                        sx={{
                            padding: '20px',
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            color: 'black',
                            textAlign: 'center'
                        }}
                    >
                        <Typography>No results found</Typography>
                    </Box>
                )}
            </Box>
        </Dialog>
    );
}
