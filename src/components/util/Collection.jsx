import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "./Card";
import { NavLink } from "react-router-dom";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DefaultButton } from "./Buttons";

// Create a transition component for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Filter Dropdown Component that can accept either options or custom content
const FilterDropdown = ({ title, options, customContent, onFilterChange, activeValues, isFirstFilter = false, isExclusivePair = false }) => {
    const [isOpen, setIsOpen] = useState(isFirstFilter);

    const handleCheckboxChange = (value) => {
        onFilterChange(value, !activeValues[value]);
    };

    // Filter options to hide opposites of selected values
    const filteredOptions = isExclusivePair 
        ? options.filter(option => {
            // If this is a negative option, check if the positive option is active
            if (option.oppositeOf) {
                return !activeValues[option.oppositeOf];
            }
            // For positive options, check if its negative counterpart is active
            const oppositeOption = options.find(o => o.oppositeOf === option.value);
            return oppositeOption ? !activeValues[oppositeOption.value] : true;
        })
        : options;

    return (
        <div className="filter-dropdown">
            <div 
                className="filter-dropdown-header" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <i className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`} />
                <h4>{title}</h4>
            </div>
            
            {isOpen && (
                <div className="filter-dropdown-content">
                    {customContent ? (
                        customContent
                    ) : (
                        <ul>
                            {filteredOptions.map((option, index) => (
                                <li key={index}>
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={activeValues[option.value] || false}
                                            onChange={() => handleCheckboxChange(option.value)}
                                        /> 
                                        {option.label}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

// Price Range Filter Component
const PriceRangeFilter = ({ min = 0, max = 3500, paramPrefix, onFilterChange, activeValues }) => {
    const minParam = `${paramPrefix}_min`;
    const maxParam = `${paramPrefix}_max`;
    
    // Initialize from URL params if available
    const [minValue, setMinValue] = useState(activeValues[minParam] !== undefined ? activeValues[minParam] : min);
    const [maxValue, setMaxValue] = useState(activeValues[maxParam] !== undefined ? activeValues[maxParam] : max);
    const [isDraggingMin, setIsDraggingMin] = useState(false);
    const [isDraggingMax, setIsDraggingMax] = useState(false);
    const sliderRef = useRef(null);
    
    // Reset values when activeValues change (like when filter bubbles are removed)
    useEffect(() => {
        // Handle min value reset
        if (activeValues[minParam] === undefined) {
            setMinValue(min);
        } else {
            setMinValue(activeValues[minParam]);
        }
        
        // Handle max value reset
        if (activeValues[maxParam] === undefined) {
            setMaxValue(max);
        } else {
            setMaxValue(activeValues[maxParam]);
        }
    }, [activeValues, minParam, maxParam, min, max]);
    
    // Display empty string instead of 0 for better UX
    const displayMinValue = minValue === 0 ? '' : minValue;
    
    // Update URL params when slider values change
    useEffect(() => {
        if (!isDraggingMin && !isDraggingMax) {
            // For min value, treat 0 as a valid filter value
            if (minValue !== min) {
                onFilterChange(minParam, minValue);
            } else if (activeValues[minParam] !== undefined) {
                onFilterChange(minParam, undefined);
            }
            
            if (maxValue !== max) {
                onFilterChange(maxParam, maxValue);
            } else if (activeValues[maxParam] !== undefined) {
                onFilterChange(maxParam, undefined);
            }
        }
    }, [minValue, maxValue, isDraggingMin, isDraggingMax]);
    
    const getPercentage = (value) => {
        // Map the value from the [min, max] range to the [0, 100] range
        const percentage = ((value - min) / (max - min)) * 100;
        
        // Add buffer only at the edges for better handle usability
        const buffer = 12;
        const bufferPercentage = (buffer / sliderRef.current?.clientWidth) * 100 || 0;
        
        // For minimum value, return nearly 0 (with tiny buffer)
        if (value === min) return 0;
        // For maximum value, return nearly 100 (with tiny buffer)
        if (value === max) return 100;
        
        // For values in between, apply buffer on both sides proportionally
        return bufferPercentage + percentage * (100 - 2 * bufferPercentage) / 100;
    };
    
    const handleMinChange = (e) => {
        const inputValue = e.target.value === '' ? min : parseInt(e.target.value);
        if (isNaN(inputValue)) return;
        const constrainedValue = Math.max(min, Math.min(inputValue, maxValue - 50));
        setMinValue(constrainedValue);
    };
    
    const handleMaxChange = (e) => {
        const inputValue = e.target.value === '' ? 0 : parseInt(e.target.value);
        if (isNaN(inputValue)) return;
        const constrainedValue = Math.max(minValue + 50, Math.min(inputValue, max));
        setMaxValue(constrainedValue);
    };
    
    const handleSliderClick = (e) => {
        if (!sliderRef.current) return;
        
        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const value = Math.round(min + percentage * (max - min));
        
        // Determine whether to move min or max handle
        const minDistance = Math.abs(value - minValue);
        const maxDistance = Math.abs(value - maxValue);
        
        if (minDistance <= maxDistance) {
            setMinValue(Math.max(min, Math.min(value, maxValue - 50)));
        } else {
            setMaxValue(Math.max(value, minValue + 50));
        }
    };
    
    const handleMouseDown = (e, isMin) => {
        e.preventDefault();
        if (isMin) {
            setIsDraggingMin(true);
        } else {
            setIsDraggingMax(true);
        }
    };
    
    const handleMouseMove = useCallback((e) => {
        if (!sliderRef.current || (!isDraggingMin && !isDraggingMax)) return;
        
        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        // This calculation doesn't account for the min value
        const value = Math.round(min + percentage * (max - min));
        
        if (isDraggingMin) {
            setMinValue(Math.max(min, Math.min(value, maxValue - 50)));
        } else if (isDraggingMax) {
            setMaxValue(Math.max(value, minValue + 50));
        }
    }, [isDraggingMin, isDraggingMax, minValue, maxValue, max, min]);
    
    const handleMouseUp = useCallback(() => {
        setIsDraggingMin(false);
        setIsDraggingMax(false);
    }, []);
    
    useEffect(() => {
        if (isDraggingMin || isDraggingMax) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingMin, isDraggingMax, handleMouseMove, handleMouseUp]);
    
    return (
        <div className="price-range-filter">
            <div className="price-inputs">
                <input 
                    type="text"
                    value={displayMinValue}
                    onChange={handleMinChange}
                    placeholder="0"
                    inputMode="numeric"
                    pattern="[0-9]*"
                />
                <span className="price-separator">-</span>
                <input 
                    type="number" 
                    value={maxValue} 
                    onChange={handleMaxChange}
                    min={minValue + 50}
                    max={max}
                />
            </div>
            
            <div 
                className="price-slider"
                ref={sliderRef}
                onClick={handleSliderClick}
            >
                <div className="price-slider-track"></div>
                <div 
                    className="price-slider-progress"
                    style={{
                        left: `${getPercentage(minValue)}%`,
                        width: `${getPercentage(maxValue) - getPercentage(minValue)}%`
                    }}
                ></div>
                <div 
                    className="price-slider-handle min-handle"
                    style={{ left: `${getPercentage(minValue)}%` }}
                    onMouseDown={(e) => handleMouseDown(e, true)}
                ></div>
                <div 
                    className="price-slider-handle max-handle"
                    style={{ left: `${getPercentage(maxValue)}%` }}
                    onMouseDown={(e) => handleMouseDown(e, false)}
                ></div>
            </div>
            <div className="price-range-labels">
                <span>${min}</span>
                <span>${max}</span>
            </div>
        </div>
    );
};

// Add this component before the main Collection component

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Calculate which page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        
        // Always show first page
        pages.push(1);
        
        // Show ellipsis after first page if needed
        if (currentPage > 4) {
            pages.push('...');
        }
        
        // Show up to 2 pages before current page
        for (let i = Math.max(2, currentPage - 2); i < currentPage; i++) {
            pages.push(i);
        }
        
        // Current page (if not first or last)
        if (currentPage !== 1 && currentPage !== totalPages) {
            pages.push(currentPage);
        }
        
        // Show up to 2 pages after current page
        for (let i = currentPage + 1; i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            pages.push(i);
        }
        
        // Show ellipsis before last page if needed
        if (currentPage < totalPages - 3) {
            pages.push('...');
        }
        
        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };
    
    if (totalPages <= 1) return null;
    
    return (
        <div className="pagination">
            <button 
                className="pagination-arrow"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            <div className="pagination-numbers">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                        <button
                            key={page}
                            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>
            
            <button 
                className="pagination-arrow"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
};

// Add this component before the main Collection component

const ActiveFilters = ({ filters, options, onFilterRemove, onClearAll, isMobile }) => {
    // Count active filters (excluding price range filters that are at their default values)
    const filterCount = Object.keys(filters).length;
    
    if (filterCount === 0) return null;
    
    // Find label for a filter option with its category
    const getFilterLabel = (key, value) => {
        // Skip undefined values
        if (value === undefined) return null;
        
        // Handle price filters differently - keep short for both desktop and mobile
        if (key.endsWith('_min')) {
            return isMobile ? `$${value}+` : `Price: Min $${value}`;
        }
        if (key.endsWith('_max')) {
            return isMobile ? `$${value}` : `Price: Max $${value}`;
        }
        
        // Find which filter group this option belongs to and the option itself
        for (const group of options) {
            if (group.type === 'checkbox') {
                const option = group.options.find(opt => opt.value === key);
                if (option) {
                    // For mobile, return just the label without the category
                    if (isMobile) {
                        return option.label;
                    }
                    
                    // For desktop, return with category: label format
                    const categoryName = group.title.replace(/:$/, ''); // Remove any trailing colon
                    return `${categoryName}: ${option.label}`;
                }
            }
        }
        
        return key; // Fallback
    };

    return (
        <div className="active-filters">
            {filterCount > 1 && (
                <button 
                    className="filter-bubble clear-all"
                    onClick={onClearAll}
                >
                    Clear All
                </button>
            )}
            
            {Object.entries(filters)
                .filter(([_, value]) => value !== undefined) // Filter out undefined values
                .map(([key, value]) => (
                    <button 
                        key={key} 
                        className="filter-bubble"
                        onClick={() => onFilterRemove(key)}
                    >
                        {getFilterLabel(key, value)}
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                ))}
        </div>
    );
};

// Filter Area Component
const FilterArea = ({ filterOptions, activeFilters, onFilterChange }) => {
    return (
        <div className="collection-filters">
            {filterOptions.map((filter, index) => (
                <FilterDropdown 
                    key={index}
                    title={filter.title} 
                    isFirstFilter={index === 0}
                    isExclusivePair={filter.isExclusivePair}
                    customContent={
                        filter.type === "priceRange" 
                            ? <PriceRangeFilter 
                                min={filter.min} 
                                max={filter.max}
                                paramPrefix={filter.paramPrefix}
                                onFilterChange={onFilterChange}
                                activeValues={activeFilters}
                              /> 
                            : null
                    }
                    options={filter.type === "checkbox" ? filter.options : null}
                    onFilterChange={(value, isChecked) => onFilterChange(value, isChecked)}
                    activeValues={activeFilters}
                />
            ))}
        </div>
    );
};

export default function Collection({ 
    data = [], 
    filterOptions = [], 
    sortOptions = [],
    activeFilters = {},
    activeSort = '',
    searchQuery = '',
    itemsPerPage = 12,
    currentPage = 1,
    collection = '',
    loading = false,
    onFilterChange,
    onSortChange,
    onSearchChange,
    onItemsPerPageChange,
    onPageChange,
    isSearchCollection = false
}) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
    
    // Track window width for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 770);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearchInputChange = (e) => {
        onSearchChange(e.target.value);
    };

    // For search collection, we'll open the header search dialog
    const handleSearchClick = (e) => {
        if (isSearchCollection) {
            e.preventDefault();
            // Find the header search button and click it
            const searchButton = document.querySelector('.header-icon[aria-label="Search"]');
            if (searchButton) {
                searchButton.click();
            }
        }
    };

    const handleSortChange = (e) => {
        onSortChange(e.target.value);
    };

    const handleItemsPerPageChange = (e) => {
        onItemsPerPageChange(parseInt(e.target.value));
    };

    // When a page button is clicked
    const handlePageButtonClick = (page) => {
        onPageChange(page);
        // Scroll to top of the product list for better UX
        window.scrollTo({
            top: document.querySelector('.collection-listing').offsetTop - 200,
            behavior: 'smooth'
        });
    };

    // Calculate pagination values
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    // Add validation for itemsPerPage values
    const validItemsPerPageValues = [12, 24, 48];

    // Handle removing a single filter
    const handleFilterRemove = (key) => {
        onFilterChange(key, undefined);
    };
    
    // Handle clearing all filters
    const handleClearAllFilters = () => {
        Object.keys(activeFilters).forEach(key => {
            onFilterChange(key, undefined);
        });
    };
    
    const toggleMobileFilters = () => {
        setShowMobileFilters(!showMobileFilters);
    };
    
    return (
        <div className="collection-wrapper">
            {/* Mobile filters dialog - only show for regular collections */}
            {isMobile && !isSearchCollection && (
                <Dialog
                    fullScreen
                    open={showMobileFilters}
                    onClose={toggleMobileFilters}
                    TransitionComponent={Transition}
                >
                    <div className="mobile-filter-header" style={{ 
                        borderBottom: '1px solid #eee',
                        padding: '15px 20px',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'white',
                        zIndex: 1000
                    }}>
                        <h1 className="dialog-header1">Filter By</h1>
                        <button
                            type="button"
                            className="fa-solid fa-xmark admin-action-button"
                            onClick={toggleMobileFilters}
                            style={{ 
                                fontSize: '1.8rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: "0 10px"
                            }}
                        />
                    </div>
                    <div className="dialog-filter-container">
                        <FilterArea 
                            filterOptions={filterOptions} 
                            activeFilters={activeFilters}
                            onFilterChange={onFilterChange}
                        />
                    </div>
                    <DialogActions sx={{ 
                        position: 'sticky', 
                        bottom: 0, 
                        bgcolor: 'white', 
                        borderTop: '1px solid #eee',
                        padding: '15px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <DefaultButton 
                            text={`See ${data.length} Product(s)`}
                            onClick={toggleMobileFilters}
                        />
                    </DialogActions>
                </Dialog>
            )}
            
            <div className="collection-container">
                {/* Desktop Filters Column - hidden on mobile and search collections */}
                {!isSearchCollection && (
                    <FilterArea 
                        filterOptions={filterOptions} 
                        activeFilters={activeFilters}
                        onFilterChange={onFilterChange}
                    />
                )}

                {/* Main content area */}
                <div className="collection-content">
                    {/* Search bar - always at the top */}
                    <div className="collection-search">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        <input 
                            type="text" 
                            placeholder="Search products" 
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onClick={handleSearchClick}
                            readOnly={isSearchCollection} // Make read-only for search collection
                        />
                    </div>
                    
                    {/* Mobile controls - Filter button and Sort dropdown (hide for search collection) */}
                    {isMobile && !isSearchCollection && (
                        <>
                            <div className="mobile-controls-row">
                                <button className="filter-button" onClick={toggleMobileFilters}>
                                    <i className="fa-solid fa-filter"></i>
                                    Filter By
                                </button>
                                
                                <div className="mobile-sorting-options">
                                    <select value={activeSort} onChange={handleSortChange}>
                                        {sortOptions.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Product count for mobile */}
                            <div className="mobile-product-count">
                                {loading ? null : `${data.length} Products`}
                            </div>
                        </>
                    )}
                    
                    {/* Desktop controls - only shown on desktop for regular collections */}
                    {!isMobile && !isSearchCollection && (
                        <div className="collection-controls">
                            <div className="product-count">
                                {loading ? null : `${data.length} products`}
                            </div>
                            <div className="display-options">
                                <div className="items-per-page">
                                    <select 
                                        value={validItemsPerPageValues.includes(itemsPerPage) ? itemsPerPage : 12}
                                        onChange={handleItemsPerPageChange}
                                        className="show-select"
                                    >
                                        <option value="12">Show 12</option>
                                        <option value="24">Show 24</option>
                                        <option value="48">Show 48</option>
                                        {!validItemsPerPageValues.includes(itemsPerPage) && (
                                            <option value={itemsPerPage}>Show {itemsPerPage}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="sorting-options">
                                    <select value={activeSort} onChange={handleSortChange}>
                                        {sortOptions.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Filters - hide for search collection */}
                    {!isSearchCollection && (
                        <ActiveFilters 
                            filters={activeFilters}
                            options={filterOptions}
                            onFilterRemove={handleFilterRemove}
                            onClearAll={handleClearAllFilters}
                            isMobile={isMobile}
                        />
                    )}

                    {/* Product listing - same for both mobile and desktop */}
                    <div className="collection-listing">
                        {loading ? (
                            null
                        ) : currentItems.length > 0 ? (
                            <ul>
                                {currentItems.map((item, index) => {
                                    // Fix the collection comparison and handle material title fields
                                    let title;
                                    let tag;
                                    let linkTo;

                                    if (collection === 'cues' || item.cueNumber) {
                                        title = item.name;
                                        tag = item.cueNumber;
                                        linkTo = `/cues/${item._id}`;
                                    } else if (collection === 'accessories' || item.accessoryNumber) {
                                        title = item.name;
                                        tag = item.accessoryNumber;
                                        linkTo = `/accessories/${item._id}`;
                                    } else {
                                        // For materials, handle both wood and crystal types
                                        title = item.commonName || item.crystalName || item.name || 'Unknown';
                                        linkTo = `/materials/${item._id}`;
                                    }
                                    
                                    return (
                                        <li key={index}>
                                            <Card 
                                                image={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '/placeholder.png'}
                                                title={title}
                                                tag={tag}
                                                price={item.price}
                                                linkTo={isSearchCollection ? linkTo : `/${collection}/${item._id}`}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="empty-collection-message">
                                        {isSearchCollection ? (<div>
                                            <p>No products found for "{searchQuery}". Try a different search term. For additional information or requests visit the <NavLink to="/pages/contact" className="inline-link">contact us page</NavLink>.</p>
                                            </div>
                                ) : Object.keys(activeFilters).length === 0 && !searchQuery ? (
                                    <div>
                                        <p>
                                            There are currently no products in this collection, for additional information or requests visit the <NavLink to="/pages/contact" className="inline-link">contact us page</NavLink>.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p>
                                            No products found that match your current filters. For additional information or requests visit the <NavLink to="/pages/contact" className="inline-link">contact us page</NavLink>.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {!loading && currentItems.length > 0 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageButtonClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}