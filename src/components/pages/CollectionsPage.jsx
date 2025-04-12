import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCueCollection } from "../../util/requests";
import Collection from "../util/Collection";

export default function CollectionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(location.pathname.split("/").pop());
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // New state for filtered data
    const [filterOptions, setFilterOptions] = useState([]);
    const [sortOptions, setSortOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [activeSort, setActiveSort] = useState('');

    // Parse URL parameters on initial load
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setSearchQuery(searchParams.get('search') || '');
        setActiveSort(searchParams.get('sort') || '');
        
        // Parse filter params
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            if (key !== 'search' && key !== 'sort') {
                if (key.startsWith('price_')) {
                    params[key] = parseInt(value);
                } else {
                    params[key] = value === 'true';
                }
            }
        }
        setActiveFilters(params);
    }, [location.pathname]);

    // Filter function to apply filters to data
    const filterData = useCallback(() => {
        // For now, just return all data
        // This will be expanded later with actual filtering logic
        setFilteredData(data);
        
        // Log that the filter function was called
        console.log("Filter function called with:", {
            filters: activeFilters,
            search: searchQuery,
            sort: activeSort
        });
    }, [data, activeFilters, searchQuery, activeSort]);

    // Apply filters whenever filter parameters or data changes
    useEffect(() => {
        filterData();
    }, [filterData, data, activeFilters, searchQuery, activeSort]);

    // Update URL when filters change
    useEffect(() => {
        if (!collection) return;
        
        const searchParams = new URLSearchParams();
        
        // Add search query
        if (searchQuery) searchParams.set('search', searchQuery);
        
        // Add sort option
        if (activeSort) searchParams.set('sort', activeSort);
        
        // Add filter values
        Object.entries(activeFilters).forEach(([key, value]) => {
            // Only add the parameter if value is not undefined or null
            if (value !== undefined && value !== null) {
                searchParams.set(key, value.toString());
            }
        });
        
        // Update URL without reloading page
        const newUrl = `${location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        navigate(newUrl, { replace: true });
    }, [searchQuery, activeSort, activeFilters, collection, navigate, location.pathname]);

    // update data when changing to another collection
    useEffect(() => {
        const path = location.pathname.split("/").pop();
        setCollection(path);
    }, [location.pathname]);

    useEffect(() => {
        // Define collection-specific filters and sort options
        switch (collection) {
            case "cues":
                setFilterOptions([
                    {
                        title: "Price",
                        type: "priceRange",
                        min: 0,
                        max: 3500,
                        paramPrefix: "price"
                    },
                    {
                        title: "Features",
                        type: "checkbox",
                        options: [
                            { label: "Inlays", value: "inlays" },
                            { label: "Points", value: "points" },
                            { label: "Wrap", value: "wrap" }
                        ]
                    },
                ]);
                setSortOptions([
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                ]);
                getCueCollection()
                    .then((res) => {
                        setData([...res.data, ...res.data, ...res.data, ...res.data, ...res.data]);
                    });
                break;
                
            case "accessories":
                setFilterOptions([
                    {
                        title: "Price",
                        type: "priceRange",
                        min: 0,
                        max: 500,
                        paramPrefix: "price"
                    },
                    {
                        title: "Category",
                        type: "checkbox",
                        options: [
                            { label: "Cases", value: "cases" },
                            { label: "Tips", value: "tips" },
                            { label: "Chalk", value: "chalk" },
                            { label: "Gloves", value: "gloves" },
                            { label: "Towels", value: "towels" }
                        ]
                    }
                ]);
                setSortOptions([
                    { value: "featured", label: "Featured" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "alphabet", label: "Alphabetical" }
                ]);
                break;
                
            case "materials":
                setFilterOptions([
                    {
                        title: "Price",
                        type: "priceRange",
                        min: 0,
                        max: 1000,
                        paramPrefix: "price"
                    },
                    {
                        title: "Category",
                        type: "checkbox",
                        options: [
                            { label: "Wood", value: "wood" },
                            { label: "Wraps", value: "wraps" },
                            { label: "Inlays", value: "inlays" },
                            { label: "Joint Parts", value: "joints" },
                            { label: "Miscellaneous", value: "misc" }
                        ]
                    }
                ]);
                setSortOptions([
                    { value: "featured", label: "Featured" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" }
                ]);
                break;
        }
    }, [collection]);
    
    // Handle filter changes
    const handleFilterChange = (filterKey, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (value === false) {
                // Remove the filter entirely when unchecking
                delete newFilters[filterKey];
            } else {
                // Otherwise set the value
                newFilters[filterKey] = value;
            }
            
            return newFilters;
        });
    };
    
    // Handle search changes
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };
    
    // Handle sort changes
    const handleSortChange = (sortValue) => {
        setActiveSort(sortValue);
    };
    
    return (
        <div className="collection-page">
            <CollectionBanner collection={collection} />
            <Collection 
                data={filteredData} // Use filteredData instead of raw data
                filterOptions={filterOptions} 
                sortOptions={sortOptions}
                activeFilters={activeFilters}
                activeSort={activeSort}
                searchQuery={searchQuery}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onSearchChange={handleSearchChange}
            />
        </div>
    );
}

function CollectionBanner({ collection }) {
    return (
        <div className="collection-banner">
            <h1>{collection}</h1>
        </div>
    );
}