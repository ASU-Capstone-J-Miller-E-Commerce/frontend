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
    const [loading, setLoading] = useState(true);
    
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
    }, []);

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
    const searchFilterSortData = useCallback(() => {
        let result = [...data];

        result = searchData(result);
        result = filterData(result);
        result = sortData(result);

        setFilteredData(result);
        
        // console.log("Filter function called with:", {
        //     filters: activeFilters,
        //     search: searchQuery,
        //     sort: activeSort
        // });
    }, [data, activeFilters, searchQuery, activeSort, collection]);

    // Function to handle search filtering
    function searchData(result) {
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
        return result;
    }

    // Function to apply active filters
    function filterData(result) {
        switch (collection) {
            case "cues":
                return filterCues(result);
            case "accessories":
                return filterAccessories(result);
            case "materials":
                return filterMaterials(result);
            default:
                return result;
        }
    }

    function filterCues(items) {
        // Skip filtering if no filters applied
        if (Object.keys(activeFilters).length === 0) {
            return items;
        }
        
        const minPrice = activeFilters.price_min;
        const maxPrice = activeFilters.price_max;
        
        // Get active availability filters
        const activeAvailability = Object.keys(activeFilters).filter(key => 
            ['available', 'upcoming', 'sold'].includes(key) && activeFilters[key]
        );
        
        // Get active feature filters
        const hasInlays = activeFilters.inlays;
        const hasNoInlays = activeFilters.no_inlays;
        const hasPoints = activeFilters.points;
        const hasNoPoints = activeFilters.no_points;
        const hasWrap = activeFilters.wrap;
        const hasNoWrap = activeFilters.no_wrap;
        const hasStandardButt = activeFilters.standard_butt;
        const hasFullSpliceButt = activeFilters.full_splice_butt;
        const hasNoFullSpliceButt = activeFilters.no_full_splice_butt;
        
        // Are any feature filters active?
        const hasFeatureFilters = hasInlays || hasNoInlays || hasPoints || hasNoPoints || 
                                 hasWrap || hasNoWrap || hasStandardButt || 
                                 hasFullSpliceButt || hasNoFullSpliceButt;
        
        // If no filters applied, return all items
        if ((minPrice === undefined && maxPrice === undefined) && 
            activeAvailability.length === 0 && 
            !hasFeatureFilters) {
            return items;
        }
        
        return items.filter(item => {
            // Price filtering
            if (minPrice !== undefined || maxPrice !== undefined) {
                // Skip items without price
                if (item.price === undefined || item.price === null) {
                    return false;
                }
                
                // Check if price is within range
                if (minPrice !== undefined && item.price < minPrice) {
                    return false;
                }
                
                if (maxPrice !== undefined && item.price > maxPrice) {
                    return false;
                }
            }
            
            // Availability filtering
            if (activeAvailability.length > 0) {
                // If no status on item, skip it when filtering by availability
                if (!item.status) {
                    return false;
                }
                
                // Map filter keys to expected status values
                const statusMap = {
                    'available': 'Available',
                    'upcoming': 'Coming Soon',
                    'sold': 'Sold'
                };
                
                // Check if item's status matches any active availability filter
                const matchesActiveAvailability = activeAvailability.some(key => 
                    item.status === statusMap[key]
                );
                
                if (!matchesActiveAvailability) {
                    return false;
                }
            }
            
            // Feature filtering - implement placeholder conditions
            if (hasFeatureFilters) {
                // INLAYS - placeholder filter condition
                if (hasInlays && !item.hasInlays) { // Replace with your actual condition
                    return false;
                }
                if (hasNoInlays && item.hasInlays) { // Replace with your actual condition
                    return false;
                }
                
                // POINTS - placeholder filter condition
                if (hasPoints && !item.hasPoints) { // Replace with your actual condition
                    return false;
                }
                if (hasNoPoints && item.hasPoints) { // Replace with your actual condition
                    return false;
                }
                
                // WRAP - placeholder filter condition
                if (hasWrap && !item.hasWrap) { // Replace with your actual condition
                    return false;
                }
                if (hasNoWrap && item.hasWrap) { // Replace with your actual condition
                    return false;
                }
                
                // BUTT TYPES - placeholder filter condition
                if (hasStandardButt && !item.hasStandardButt) { // Replace with your actual condition
                    return false;
                }
                if (hasFullSpliceButt && !item.hasFullSpliceButt) { // Replace with your actual condition
                    return false;
                }
                if (hasNoFullSpliceButt && item.hasFullSpliceButt) { // Replace with your actual condition
                    return false;
                }
            }
            
            // Item passed all filter tests
            return true;
        });
    }

    // Filter function for accessories collection
    function filterAccessories(items) {
        // Skip filtering if no filters applied
        if (Object.keys(activeFilters).length === 0) {
            return items;
        }
        
        const minPrice = activeFilters.price_min;
        const maxPrice = activeFilters.price_max;
        
        // If no price filters, return all items
        if (minPrice === undefined && maxPrice === undefined) {
            return items;
        }
        
        return items.filter(item => {
            // Skip items without price
            if (item.price === undefined || item.price === null) {
                return false;
            }
            
            // Check if price is within range
            if (minPrice !== undefined && item.price < minPrice) {
                return false;
            }
            
            if (maxPrice !== undefined && item.price > maxPrice) {
                return false;
            }
            
            return true;
        });
    }

    // Filter function for materials collection
    function filterMaterials(items) {
        // Skip filtering if no filters applied
        if (Object.keys(activeFilters).length === 0) {
            return items;
        }
        
        // Get active filters by category
        const activeTypes = Object.keys(activeFilters).filter(key => 
            ['wood', 'crystal'].includes(key) && activeFilters[key]
        );
        
        const activeTiers = Object.keys(activeFilters).filter(key => 
            ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].includes(key) && activeFilters[key]
        );
        
        const activeColors = Object.keys(activeFilters).filter(key => 
            COLOR_OPTIONS.some(option => option.value === key) && activeFilters[key]
        );
        
        return items.filter(item => {
            // Type filtering - check based on keys rather than materialType
            if (activeTypes.length > 0) {
                const isWood = Boolean(item.commonName);
                const isCrystal = Boolean(item.crystalName);
                
                const matchesActiveTypes = activeTypes.some(type => 
                    (type === 'wood' && isWood) || 
                    (type === 'crystal' && isCrystal)
                );
                
                if (!matchesActiveTypes) {
                    return false;
                }
            }
            
            // Tier filtering
            if (activeTiers.length > 0) {
                console.log(item.iter, activeFilters)
                const itemTier = item.tier;
                if (!item.tier || !activeTiers.includes(itemTier)) {
                    return false;
                }
            }
            
            // Color filtering
            if (activeColors.length > 0) {
                const itemColors = item.colors || [];

                if (itemColors.length === 0 || !activeColors.some(color => 
                    itemColors.some(itemColor => itemColor.includes(color))
                )) {
                    return false;
                }
            }
            
            // Item passed all filter tests
            return true;
        });
    }

    // Function to handle sorting
    function sortData(result) {
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
        return result;
    }

    // Apply filters whenever filter parameters or data changes
    useEffect(() => {
        searchFilterSortData();
    }, [searchFilterSortData, data, activeFilters, searchQuery, activeSort]);

    // Reset to page 1 when filters change
    useEffect(() => {
        // Only reset page when filters or search changes, not when page is explicitly changed
        if (!location.search.includes('page=')) {
            setCurrentPage(1);
        }
    }, [activeFilters, searchQuery, itemsPerPage, location.search]);

    // Make sure data is being loaded properly for each collection
    useEffect(() => {
        setLoading(true); // Start loading
        
        switch (collection) {
            case "cues":
                getCueCollection()
                    .then((res) => {
                        const data = [...res.data];

                        const lowestPrice = data.length ? 
                        Math.min(...data.map(item => (item.price !== undefined && item.price !== null) ? item.price : Infinity)) : 
                        0;
                    
                        const highestPrice = data.length ? 
                        Math.max(...data.map(item => (item.price !== undefined && item.price !== null) ? item.price : 0)) : 
                        10000;
                        
                        setFilterOptions([
                            {
                                title: "Price",
                                type: "priceRange",
                                min: lowestPrice,
                                max: highestPrice,
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
                                isExclusivePair: true,
                                options: [
                                    { label: "Inlays", value: "inlays" },
                                    { label: "No Inlays", value: "no_inlays", oppositeOf: "inlays" },
                                    { label: "Points", value: "points" },
                                    { label: "No Points", value: "no_points", oppositeOf: "points" },
                                    { label: "Wrap", value: "wrap" },
                                    { label: "No Wrap", value: "no_wrap", oppositeOf: "wrap" },
                                    { label: "Standard Butt", value: "standard_butt" },
                                    { label: "FullSplice  Butt", value: "full_splice_butt" },
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
                    })
                    .always(() => setLoading(false)); // End loading when done
                break;
                
            case "accessories":
                getAccessoryCollection()
                    .then((res) => {
                        const data = [...res.data];

                        const lowestPrice = data.length ? 
                        Math.min(...data.map(item => (item.price !== undefined && item.price !== null) ? item.price : Infinity)) : 
                        0;

                        const highestPrice = data.length ? 
                        Math.max(...data.map(item => (item.price !== undefined && item.price !== null) ? item.price : 0)) : 
                        500;
                            
                        setFilterOptions([
                            {
                                title: "Price",
                                type: "priceRange",
                                min: lowestPrice,
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
                    })
                    .always(() => setLoading(false)); // End loading when done
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
                            { label: "Tier 1", value: "Tier 1" },
                            { label: "Tier 2", value: "Tier 2" },
                            { label: "Tier 3", value: "Tier 3" },
                            { label: "Tier 4", value: "Tier 4" },
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
                    })
                    .always(() => setLoading(false)); // End loading when done
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
                loading={loading} // Pass loading state
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