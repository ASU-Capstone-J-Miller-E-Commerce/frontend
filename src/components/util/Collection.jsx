import React, { useState } from "react";
import { Card } from "./Card";

// Filter Dropdown Component
const FilterDropdown = ({ title, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="filter-dropdown">
            <div 
                className="filter-dropdown-header" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4>{title}</h4>
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
                    {isOpen ? '▼' : '►'}
                </span>
            </div>
            
            {isOpen && (
                <div className="filter-dropdown-content">
                    <ul>
                        {options.map((option, index) => (
                            <li key={index}>
                                <label>
                                    <input type="checkbox" /> {option}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Filter Area Component
const FilterArea = () => {
    const priceOptions = [
        "Under $100", 
        "$100 - $500", 
        "$500 - $1000", 
        "$1000+"
    ];
    
    const typeOptions = [
        "Playing Cues", 
        "Break Cues", 
        "Jump Cues"
    ];
    
    return (
        <div className="collection-filters">
            <FilterDropdown title="Price" options={priceOptions} />
            <FilterDropdown title="Type" options={typeOptions} />
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