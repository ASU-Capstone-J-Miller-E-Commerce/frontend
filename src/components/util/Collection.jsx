import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "./Card";

// Filter Dropdown Component that can accept either options or custom content
const FilterDropdown = ({ title, options, customContent, onFilterChange, activeValues }) => {
    const [isOpen, setIsOpen] = useState(true); // Default to open

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
    
    // Reset values when collection changes (different min/max)
    useEffect(() => {
        if (activeValues[minParam] === undefined && activeValues[maxParam] === undefined) {
            setMinValue(min);
            setMaxValue(max);
        }
    }, [min, max, paramPrefix]);
    
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

// Filter Area Component
const FilterArea = ({ filterOptions, activeFilters, onFilterChange }) => {
    return (
        <div className="collection-filters">
            {filterOptions.map((filter, index) => (
                <FilterDropdown 
                    key={index}
                    title={filter.title} 
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
    onFilterChange,
    onSortChange,
    onSearchChange
}) {
    const handleSearchInputChange = (e) => {
        onSearchChange(e.target.value);
    };

    const handleSortChange = (e) => {
        onSortChange(e.target.value);
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

                    {/* Product listing */}
                    <div className="collection-listing">
                        <ul>
                            {data.map((item, index) => (
                                <li key={index}>
                                    <Card 
                                        image={item.imageUrls[0]} 
                                        title={item.name} 
                                        price={item.price}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}