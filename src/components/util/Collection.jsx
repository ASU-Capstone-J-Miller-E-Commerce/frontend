import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "./Card";

// Filter Dropdown Component that can accept either options or custom content
const FilterDropdown = ({ title, options, customContent }) => {
    const [isOpen, setIsOpen] = useState(true); // Default to open

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
                                        <input type="checkbox" /> {option}
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
const PriceRangeFilter = ({ min = 0, max = 3500 }) => {
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);
    const [isDraggingMin, setIsDraggingMin] = useState(false);
    const [isDraggingMax, setIsDraggingMax] = useState(false);
    const sliderRef = useRef(null);
    
    // Display empty string instead of 0 for better UX
    const displayMinValue = minValue === 0 ? '' : minValue;
    
    // Adjust the getPercentage function in PriceRangeFilter
    const getPercentage = (value) => {
        // Create a buffer zone of 8px on each side (based on half the handle width)
        const buffer = 12;
        const bufferPercentage = (buffer / sliderRef.current?.clientWidth) * 100 || 0;
        
        // Scale the percentage to fit within the buffer zone
        const rawPercentage = (value / max) * 100;
        return bufferPercentage + rawPercentage * (100 - 2 * bufferPercentage) / 100;
    };
    
    const handleMinChange = (e) => {
        // Get value from input, using empty string if input is empty
        const inputValue = e.target.value === '' ? 0 : parseInt(e.target.value);
        
        if (isNaN(inputValue)) return;
        
        // Enforce min/max constraints
        const constrainedValue = Math.max(0, Math.min(inputValue, maxValue - 50));
        setMinValue(constrainedValue);
    };
    
    const handleMaxChange = (e) => {
        // Get value from input
        const inputValue = e.target.value === '' ? 0 : parseInt(e.target.value);
        
        if (isNaN(inputValue)) return;
        
        // Enforce min/max constraints - never exceed 3500
        const constrainedValue = Math.max(minValue + 50, Math.min(inputValue, max));
        setMaxValue(constrainedValue);
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
                    type="text" /* Changed from number to text */
                    value={displayMinValue} /* Using displayMinValue */
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
                onClick={(e) => {
                    // Only handle clicks on the track, not on the handles
                    if (e.target === e.currentTarget || e.target.className === 'price-slider-track') {
                        handleSliderClick(e);
                    }
                }}
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
const FilterArea = ({ filterOptions }) => {
    const typeOptions = [
        "Playing Cues", 
        "Break Cues", 
        "Jump Cues"
    ];
    
    return (
        <div className="collection-filters">
            {filterOptions.map((filter, index) => (
                <FilterDropdown 
                    key={index}
                    title={filter.title} 
                    customContent={
                        filter.type === "priceRange" 
                            ? <PriceRangeFilter min={filter.min} max={filter.max} /> 
                            : null
                    }
                    options={filter.type === "checkbox" ? filter.options : null}
                />
            ))}
        </div>
    );
};

export default function Collection({ data = [], filterOptions = [], sortOptions = [] }) {
    return (
        <div className="collection-wrapper">
            <div className="collection-container">
                {/* Filters Column */}
                <FilterArea filterOptions={filterOptions} />

                {/* Main content area */}
                <div className="collection-content">
                    {/* Search bar */}
                    <div className="collection-search">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" placeholder="Search products" />
                    </div>
                    
                    {/* Product count and sorting */}
                    <div className="collection-controls">
                        <div className="product-count">
                            {data.length} products
                        </div>
                        <div className="sorting-options">
                            <select>
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