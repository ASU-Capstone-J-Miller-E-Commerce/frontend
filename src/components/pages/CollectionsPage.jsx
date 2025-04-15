import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAccessoryCollection, getCueCollection, getMaterialCollection } from "../../util/requests";
import Collection from "../util/Collection";
import { COLOR_OPTIONS } from "../../util/globalConstants";

export default function CollectionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(location.pathname.split("/").pop());
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);
    const [sortOptions, setSortOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [activeSort, setActiveSort] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Track if this is an initial load or direct navigation with filters
    const isInitialMount = useRef(true);
    const lastNavigatedUrl = useRef('');
    const isFilterReset = useRef(false);

    // Special effect that only runs once on initial mount to handle direct navigation with filters
    useEffect(() => {
      // Only run on initial mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
        
        // If there are URL parameters on initial load, parse and apply them
        if (location.search) {
          const searchParams = new URLSearchParams(location.search);
          
          // Set search query from URL
          const searchParam = searchParams.get('search');
          if (searchParam) {
            setSearchQuery(searchParam);
          }
          
          // Set sort option from URL
          const sortParam = searchParams.get('sort');
          if (sortParam) {
            setActiveSort(sortParam);
          }
          
          // Set page limit from URL
          const limitParam = searchParams.get('limit');
          if (limitParam) {
            const parsedLimit = parseInt(limitParam);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
              setItemsPerPage(parsedLimit);
            }
          }
          
          // Set current page from URL
          const pageParam = searchParams.get('page');
          if (pageParam) {
            const parsedPage = parseInt(pageParam);
            if (!isNaN(parsedPage) && parsedPage > 0) {
              setCurrentPage(parsedPage);
            }
          }
          
          // Parse filter parameters
          const filterParams = {};
          for (const [key, value] of searchParams.entries()) {
            if (key !== 'search' && key !== 'sort' && key !== 'limit' && key !== 'page') {
              if (key.startsWith('price_')) {
                filterParams[key] = parseInt(value);
              } else {
                filterParams[key] = value === 'true';
              }
            }
          }
          
          // Set active filters from URL
          if (Object.keys(filterParams).length > 0) {
            setActiveFilters(filterParams);
          }
        }
      }
    }, []); // Empty dependency array ensures this runs only once

    // SINGLE effect to handle collection changes
    useEffect(() => {
        const path = location.pathname.split("/").pop();
        
        // Don't do anything if we're already on this collection
        if (path === collection) return;
        
        // When collection changes, temporarily suspend URL syncing
        isFilterReset.current = true;
        
        // Update collection first - this is our source of truth
        setCollection(path);
        
        // Only reset data, keep the filters from URL if they exist
        setFilteredData([]);
        setCurrentPage(1);
        
        // Apply any URL parameters that came with the new collection
        if (location.search) {
            const searchParams = new URLSearchParams(location.search);
            
            // Parse filters
            const newFilters = {};
            for (const [key, value] of searchParams.entries()) {
                if (key !== 'search' && key !== 'sort' && key !== 'limit' && key !== 'page') {
                    if (key.startsWith('price_')) {
                        newFilters[key] = parseInt(value);
                    } else {
                        newFilters[key] = value === 'true';
                    }
                }
            }
            
            // Set all filter states in one go
            setActiveFilters(newFilters);
            setSearchQuery(searchParams.get('search') || '');
            setActiveSort(searchParams.get('sort') || '');
            
            const limitParam = searchParams.get('limit');
            if (limitParam) {
                const parsedLimit = parseInt(limitParam);
                if (!isNaN(parsedLimit) && parsedLimit > 0) {
                    setItemsPerPage(parsedLimit);
                }
            }
            
            const pageParam = searchParams.get('page');
            if (pageParam) {
                const parsedPage = parseInt(pageParam);
                if (!isNaN(parsedPage) && parsedPage > 0) {
                    setCurrentPage(parsedPage);
                }
            }
        } else {
            // Reset filters if no URL params
            setActiveFilters({});
            setSearchQuery('');
            setActiveSort('');
        }
        
        // Re-enable URL syncing after all state updates are complete
        setTimeout(() => {
            isFilterReset.current = false;
        }, 300);
        
    }, [location.pathname]);

    // Handle URL parameter changes (only when not switching collections)
    useEffect(() => {
        // Skip during initial mount or collection change
        if (isFilterReset.current) {
            return;
        }
        
        // Skip if this change was caused by our own URL update
        if (window.location.pathname + window.location.search === lastNavigatedUrl.current) {
            return;
        }
        
        const searchParams = new URLSearchParams(location.search);
        
        // Apply URL parameters to state
        setSearchQuery(searchParams.get('search') || '');
        setActiveSort(searchParams.get('sort') || '');
        
        const limitParam = searchParams.get('limit');
        if (limitParam) {
            const parsedLimit = parseInt(limitParam);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                setItemsPerPage(parsedLimit);
            }
        }
        
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
        
    }, [location.search]);

    // Update URL when filters or pagination changes
    useEffect(() => {
        // Skip during initial mount, collection change, or if collection is empty
        if (isInitialMount.current || isFilterReset.current || !collection) {
            return;
        }
        
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
            if (value !== undefined && value !== null) {
                searchParams.set(key, value.toString());
            }
        });
        
        // Build new URL
        const newUrl = `${location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
        const currentUrl = `${location.pathname}${location.search}`;
        
        // Only update URL if it actually changed
        if (newUrl !== currentUrl) {
            // Keep track of the URL we're navigating to
            lastNavigatedUrl.current = newUrl;
            navigate(newUrl, { replace: true });
        }
    }, [searchQuery, activeSort, activeFilters, itemsPerPage, currentPage, collection, navigate, location.pathname]);

    // Filter function to apply filters to data
    const filterData = useCallback(() => {
        let result = [...data];

        if (searchQuery && searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();

            if (collection === "materials") {
                // For materials, search in both commonName and crystalName
                result = result.filter(item => {
                    const commonName = (item.commonName || '').toLowerCase();
                    const crystalName = (item.crystalName || '').toLowerCase();
                    return commonName.includes(query) || crystalName.includes(query);
                });
            } else {
                // For other collections, search in the name property
                result = result.filter(item =>
                    item.name.toLowerCase().includes(query)
                );
            }
        }

        if (activeSort) {
            switch (activeSort) {
                case "newest":
                    result.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
                    break;
                case "oldest":
                    result.sort((a, b) => new Date(a.createdOn) - new Date(a.createdOn));
                    break;
                case "price-asc":
                    result.sort((a, b) => a.price - b.price);
                    break;
                case "price-desc":
                    result.sort((a, b) => b.price - a.price);
                    break;
                case "alphabet-a-z":
                    if (collection === "materials") {
                        // For materials, use either commonName or crystalName
                        result.sort((a, b) => {
                            const nameA = a.commonName || a.crystalName || '';
                            const nameB = b.commonName || b.crystalName || '';
                            return nameA.localeCompare(nameB);
                        });
                    } else {
                        // For other collections, use the regular name property
                        result.sort((a, b) => a.name.localeCompare(b.name));
                    }
                    break;
                case "alphabet-z-a":
                    if (collection === "materials") {
                        // For materials, use either commonName or crystalName (reverse order)
                        result.sort((a, b) => {
                            const nameA = a.commonName || a.crystalName || '';
                            const nameB = b.commonName || b.crystalName || '';
                            return nameB.localeCompare(nameA);
                        });
                    } else {
                        // For other collections, use the regular name property
                        result.sort((a, b) => b.name.localeCompare(a.name));
                    }
                    break;
                default:
                    // No sorting
                    break;
            }
        }

        setFilteredData(result);
        
        // Log that the filter function was called
        console.log("Filter function called with:", {
            filters: activeFilters,
            search: searchQuery,
            sort: activeSort
        });
    }, [data, activeFilters, searchQuery, activeSort, collection]);

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

    // Make sure data is being loaded properly for each collection
    useEffect(() => {
        // Define collection-specific filters and sort options
        switch (collection) {
            case "cues":
                getCueCollection()
                    .then((res) => {
                        const data = [...res.data];
                        
                        // Calculate the highest price (round up to nearest 100)
                        const highestPrice = data.length ? 
                            Math.ceil(Math.max(...data.map(item => item.price || 0)) / 100) * 100 : 
                            10000; // Default if no data
                        
                        setFilterOptions([
                            {
                                title: "Price",
                                type: "priceRange",
                                min: 0,
                                max: highestPrice,
                                paramPrefix: "price"
                            },
                            // Other filter options remain the same
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
                        
                        setData(data);
                        setFilteredData(data);
                    });
                break;
                
            // Do the same for accessories and materials cases
            case "accessories":
                getAccessoryCollection()
                    .then((res) => {
                        const data = [...res.data];
                        
                        // Calculate highest price
                        const highestPrice = data.length ? 
                            Math.ceil(Math.max(...data.map(item => item.price || 0)) / 100) * 100 : 
                            500;
                            
                        setFilterOptions([
                            {
                                title: "Price",
                                type: "priceRange",
                                min: 0,
                                max: highestPrice,
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
            
            if (value === false || value === undefined) {
                // Remove the filter entirely when unchecking or clearing
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