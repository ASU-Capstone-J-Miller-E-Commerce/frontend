import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "./Card";

// Filter Dropdown Component that can accept either options or custom content
const FilterDropdown = ({ title, options, customContent, onFilterChange, activeValues, isFirstFilter = false }) => {
    const [isOpen, setIsOpen] = useState(isFirstFilter); // Only open if it's the first filter

    const handleCheckboxChange = (value) => {
        onFilterChange(value, !activeValues[value]);
    };

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
                            {options.map((option, index) => (
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
        const buffer = 12;
        const bufferPercentage = (buffer / sliderRef.current?.clientWidth) * 100 || 0;
        const rawPercentage = (value / max) * 100;
        return bufferPercentage + rawPercentage * (100 - 2 * bufferPercentage) / 100;
    };
    
    const handleMinChange = (e) => {
        const inputValue = e.target.value === '' ? 0 : parseInt(e.target.value);
        if (isNaN(inputValue)) return;
        const constrainedValue = Math.max(0, Math.min(inputValue, maxValue - 50));
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
        const value = Math.round(percentage * max);
        
        // Determine whether to move min or max handle
        const minDistance = Math.abs(value - minValue);
        const maxDistance = Math.abs(value - maxValue);
        
        if (minDistance <= maxDistance) {
            setMinValue(Math.min(value, maxValue - 50));
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
        const value = Math.round(percentage * max);
        
        if (isDraggingMin) {
            setMinValue(Math.min(value, maxValue - 50));
        } else if (isDraggingMax) {
            setMaxValue(Math.max(value, minValue + 50));
        }
    }, [isDraggingMin, isDraggingMax, minValue, maxValue, max]);
    
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

const ActiveFilters = ({ filters, options, onFilterRemove, onClearAll }) => {
    // Count active filters (excluding price range filters that are at their default values)
    const filterCount = Object.keys(filters).length;
    
    if (filterCount === 0) return null;
    
    // Find label for a filter option with its category
    const getFilterLabel = (key, value) => {
        // Skip undefined values
        if (value === undefined) return null;
        
        // Handle price filters differently
        if (key.endsWith('_min')) {
            return `Price: Min $${value}`;
        }
        if (key.endsWith('_max')) {
            return `Price: Max $${value}`;
        }
        
        // Find which filter group this option belongs to and the option itself
        for (const group of options) {
            if (group.type === 'checkbox') {
                const option = group.options.find(opt => opt.value === key);
                if (option) {
                    // Return with category: label format
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
                    isFirstFilter={index === 0} // Only the first filter (index 0) gets true
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
    collection = '', // Add this new prop
    onFilterChange,
    onSortChange,
    onSearchChange,
    onItemsPerPageChange,
    onPageChange
}) {
    const handleSearchInputChange = (e) => {
        onSearchChange(e.target.value);
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

    return (
        <div className="collection-wrapper">
            <div className="collection-container">
                {/* Filters Column */}
                <FilterArea 
                    filterOptions={filterOptions} 
                    activeFilters={activeFilters}
                    onFilterChange={onFilterChange}
                />

                {/* Main content area */}
                <div className="collection-content">
                    {/* Search bar */}
                    <div className="collection-search">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        <input 
                            type="text" 
                            placeholder="Search products" 
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                    
                    {/* Product count and sorting */}
                    <div className="collection-controls">
                        <div className="product-count">
                            {data.length} products
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

                    {/* Active Filters */}
                    <ActiveFilters 
                        filters={activeFilters}
                        options={filterOptions}
                        onFilterRemove={handleFilterRemove}
                        onClearAll={handleClearAllFilters}
                    />

                    {/* Product listing */}
                    <div className="collection-listing">
                        <ul>
                            {currentItems.map((item, index) => {
                                // Fix the collection comparison and handle material title fields
                                let title;
                                let tag;

                                if (collection === 'cues' || collection === 'accessories') {
                                    title = item.name;
                                    tag = item.cueNumber || item.accessoryNumber;
                                } else {
                                    // For materials, handle both wood and crystal types
                                    title = item.commonName || item.crystalName || item.name || 'Unknown';
                                }
                                
                                return (
                                    <li key={index}>
                                        <Card 
                                            image={item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '/placeholder.png'}
                                            title={title}
                                            tag={tag}
                                            price={item.price}
                                            linkTo={`/${collection}/${item._id}`} // Generate link using collection name
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    {/* Pagination */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageButtonClick}
                    />
                </div>
            </div>
        </div>
    );
}