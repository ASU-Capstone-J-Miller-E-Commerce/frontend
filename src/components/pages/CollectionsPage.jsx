import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessoryCollection, getCueCollection, getMaterialCollection } from "../../util/requests";
import Collection from "../util/Collection";
import { COLOR_OPTIONS } from "../../util/globalConstants";

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
    const [itemsPerPage, setItemsPerPage] = useState(12); // Default is 12
    const [currentPage, setCurrentPage] = useState(1);

    // Parse URL parameters on initial load
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setSearchQuery(searchParams.get('search') || '');
        setActiveSort(searchParams.get('sort') || '');

        // Get limit from URL with validation
        const limitParam = searchParams.get('limit');
        if (limitParam) {
            const parsedLimit = parseInt(limitParam);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                setItemsPerPage(parsedLimit);
            }
        }
        
        // Get page number from URL
        const pageParam = searchParams.get('page');
        if (pageParam) {
            const parsedPage = parseInt(pageParam);
            if (!isNaN(parsedPage) && parsedPage > 0) {
                setCurrentPage(parsedPage);
            }
        }
        
        // Parse filter params
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            if (key !== 'search' && key !== 'sort' && key !== 'limit' && key !== 'page') {
                if (key.startsWith('price_')) {
                    params[key] = parseInt(value);
                } else {
                    params[key] = value === 'true';
                }
            }
        }
        setActiveFilters(params);
    }, [location.pathname, location.search]);

    // Filter function to apply filters to data
    const filterData = useCallback(() => {
        // For now, just return all data
        // This will be expanded later with actual filtering logic
        setFilteredData(data);
        
        // Log that the filter function was called
        // console.log("Filter function called with:", {
        //     filters: activeFilters,
        //     search: searchQuery,
        //     sort: activeSort
        // });
    }, [data, activeFilters, searchQuery, activeSort]);

    // Apply filters whenever filter parameters or data changes
    useEffect(() => {
        filterData();
    }, [filterData, data, activeFilters, searchQuery, activeSort]);

    // Reset to page 1 when filters change
    useEffect(() => {
        // Only reset page when filters or search changes, not when page is explicitly changed
        if (!location.search.includes('page=')) {
            setCurrentPage(1);
        }
    }, [activeFilters, searchQuery, itemsPerPage, location.search]);

    // Update URL when filters or pagination changes
    useEffect(() => {
        if (!collection) return;
        
        // Keep track of the last URL we set to avoid loops
        const searchParams = new URLSearchParams();
        
        // Add search query
        if (searchQuery) searchParams.set('search', searchQuery);
        
        // Add sort option
        if (activeSort) searchParams.set('sort', activeSort);
        
        // Add items per page if not default
        if (itemsPerPage !== 12) {
            searchParams.set('limit', itemsPerPage.toString());
        }
        
        // Add current page if not on first page
        if (currentPage > 1) {
            searchParams.set('page', currentPage.toString());
        }
        
        // Add filter values
        Object.entries(activeFilters).forEach(([key, value]) => {
            // Only add the parameter if value is not undefined or null
            if (value !== undefined && value !== null) {
                searchParams.set(key, value.toString());
            }
        });
        
        // Only update URL if it actually changed
        const newUrl = `${location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        const currentUrl = `${location.pathname}${location.search}`;
        
        if (newUrl !== currentUrl) {
            navigate(newUrl, { replace: true });
        }
    }, [searchQuery, activeSort, activeFilters, itemsPerPage, currentPage, collection, navigate, location.pathname]);

    // update data when changing to another collection
    useEffect(() => {
        const path = location.pathname.split("/").pop();
        setCollection(path);
    }, [location.pathname]);

    // Add this near the top of your component
    useEffect(() => {
        // Reset both current page and filtered data when the collection changes
        setCurrentPage(1);
        setFilteredData([]);
        setActiveFilters({}); // Add this line to clear active filters
    }, [collection]);

    // Make sure data is being loaded properly for each collection
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
                        title: "Availability",
                        type: "checkbox",
                        options: [
                            { label: "Available", value: "available" },
                            { label: "Upcoming", value: "upcoming" },
                            { label: "Sold", value: "sold" }
                        ]
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
                    { value: "newest", label: "Date: Newest First" },
                    { value: "oldest", label: "Date: Oldest First" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "alphabet-a-z", label: "Alphabetical: A-Z" },
                    { value: "alphabet-z-a", label: "Alphabetical: Z-A" },
                ]);
                getCueCollection()
                    .then((res) => {
                        console.log(res.data);
                        const data = [...res.data];
                        setData(data);
                        setFilteredData(data); // Initialize filtered data as well
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
                ]);
                setSortOptions([
                    { value: "newest", label: "Date: Newest First" },
                    { value: "oldest", label: "Date: Oldest First" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" },
                    { value: "alphabet-a-z", label: "Alphabetical: A-Z" },
                    { value: "alphabet-z-a", label: "Alphabetical: Z-A" },
                ]);
                // Add dummy data for testing pagination
                getAccessoryCollection()
                    .then((res) => {
                        console.log(res.data);
                        const data = [...res.data];
                        setData(data);
                        setFilteredData(data);
                    });
                break;
                
            case "materials":
                setFilterOptions([
                    {
                        title: "Material Type",
                        type: "checkbox",
                        options: [
                            { label: "Wood", value: "wood" },
                            { label: "Stones/Crystals", value: "crystal" },
                        ]
                    },
                    {
                        title: "Tier",
                        type: "checkbox",
                        options: [
                            { label: "Tier 1", value: "tier1" },
                            { label: "Tier 2", value: "tier2" },
                            { label: "Tier 3", value: "tier3" },
                            { label: "Tier 4", value: "tier4" },
                        ]
                    },
                    {
                        title: "Color",
                        type: "checkbox",
                        options: COLOR_OPTIONS
                    },

                ]);
                setSortOptions([
                    { value: "newest", label: "Date: Newest First" },
                    { value: "oldest", label: "Date: Oldest First" },
                    { value: "alphabet-a-z", label: "Alphabetical: A-Z" },
                    { value: "alphabet-z-a", label: "Alphabetical: Z-A" },
                ]);
                getMaterialCollection()
                    .then((res) => {
                        const data = [...res.data];
                        setData(data);
                        setFilteredData(data);
                    });
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
    
    // Handle items per page changes
    const handleItemsPerPageChange = (count) => {
        setItemsPerPage(count);
    };

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
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
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                collection={collection}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onSearchChange={handleSearchChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                onPageChange={handlePageChange}
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