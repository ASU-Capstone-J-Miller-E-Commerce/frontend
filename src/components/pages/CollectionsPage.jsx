import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCueCollection } from "../../util/requests";
import Collection from "../util/Collection";

export default function CollectionsPage() {
    const location = useLocation();
    const [collection, setCollection] = useState(location.pathname.split("/").pop());
    const [data, setData] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);
    const [sortOptions, setSortOptions] = useState([]);

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
                        max: 3500
                    },
                    {
                        title: "Features",
                        type: "checkbox",
                        options: ["Inlays", "Points", "Wrap"]
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
                        max: 500
                    },
                    {
                        title: "Category",
                        type: "checkbox",
                        options: ["Cases", "Tips", "Chalk", "Gloves", "Towels"]
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
                        max: 1000
                    },
                    {
                        title: "Category",
                        type: "checkbox",
                        options: ["Wood", "Wraps", "Inlays", "Joint Parts", "Miscellaneous"]
                    }
                ]);
                setSortOptions([
                    { value: "featured", label: "Featured" },
                    { value: "price-asc", label: "Price: Low to High" },
                    { value: "price-desc", label: "Price: High to Low" }
                ]);
                // Add your materials fetching logic here
                break;
        }
    }, [collection]);
    
    return (
        <div className="collection-page">
            <CollectionBanner collection={collection} />
            <Collection 
                data={data} 
                filterOptions={filterOptions} 
                sortOptions={sortOptions} 
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