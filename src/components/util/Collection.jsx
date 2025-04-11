import React, { useState, useRef } from "react";
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
    
    // Calculate percentage for slider positioning
    const getPercentage = (value) => {
        return Math.max(0, Math.min(100, (value / 3500) * 100));
    };
    
    const handleMinChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setMinValue(Math.min(value, maxValue - 50));
    };
    
    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setMaxValue(Math.max(value, minValue + 50));
    };
    
    const handleSliderClick = (e) => {
        if (!sliderRef.current) return;
        
        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const value = Math.round(percentage * 3500);
        
        // Determine which handle to move based on proximity
        if (Math.abs(value - minValue) < Math.abs(value - maxValue)) {
            setMinValue(Math.min(value, maxValue - 50));
        } else {
            setMaxValue(Math.max(value, minValue + 50));
        }
    };
    
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
                ></div>
                <div 
                    className="price-slider-handle max-handle"
                    style={{ left: `${getPercentage(maxValue)}%` }}
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