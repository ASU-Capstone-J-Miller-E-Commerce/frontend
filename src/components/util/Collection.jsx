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
const PriceRangeFilter = () => {
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(3500);
    const [isDraggingMin, setIsDraggingMin] = useState(false);
    const [isDraggingMax, setIsDraggingMax] = useState(false);
    const sliderRef = useRef(null);
    
    // Adjust the getPercentage function in PriceRangeFilter
    const getPercentage = (value) => {
        // Create a buffer zone of 8px on each side (based on half the handle width)
        const buffer = 12;
        const bufferPercentage = (buffer / sliderRef.current?.clientWidth) * 100 || 0;
        
        // Scale the percentage to fit within the buffer zone
        const rawPercentage = (value / 3500) * 100;
        return bufferPercentage + rawPercentage * (100 - 2 * bufferPercentage) / 100;
    };
    
    const handleMinChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setMinValue(Math.min(value, maxValue - 50));
    };
    
    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setMaxValue(Math.max(value, minValue + 50));
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
        const value = Math.round(percentage * 3500);
        
        if (isDraggingMin) {
            setMinValue(Math.min(value, maxValue - 50));
        } else if (isDraggingMax) {
            setMaxValue(Math.max(value, minValue + 50));
        }
    }, [isDraggingMin, isDraggingMax, minValue, maxValue]);
    
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
                    type="number" 
                    value={minValue} 
                    onChange={handleMinChange}
                    min="0"
                    max="3450"
                />
                <span className="price-separator">-</span>
                <input 
                    type="number" 
                    value={maxValue} 
                    onChange={handleMaxChange}
                    min="50"
                    max="3500"
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
        </div>
    );
};

// Filter Area Component
const FilterArea = () => {
    const typeOptions = [
        "Playing Cues", 
        "Break Cues", 
        "Jump Cues"
    ];
    
    return (
        <div className="collection-filters">
            <FilterDropdown 
                title="Price" 
                customContent={<PriceRangeFilter />} 
            />
            <FilterDropdown 
                title="Type" 
                options={typeOptions} 
            />
        </div>
    );
};

export default function Collection({ data=[] }) {
    return (
        <div className="collection-wrapper">
            <div className="collection-container">
                {/* Filters Column */}
                <FilterArea />

                {/* Main content area */}
                <div className="collection-content">
                    {/* Search bar */}
                    <div className="collection-search">
                        <input type="text" placeholder="Search products..." />
                    </div>
                    
                    {/* Product count and sorting */}
                    <div className="collection-controls">
                        <div className="product-count">
                            {data.length} products
                        </div>
                        <div className="sorting-options">
                            <select>
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A-Z</option>
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