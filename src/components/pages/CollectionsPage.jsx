import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCueCollection } from "../../util/requests";
import Collection from "../util/Collection";

export default function CollectionsPage () {
    const location = useLocation();
    const [collection, setCollection] = useState(location.pathname.split("/").pop());
    const [data, setData] = useState([]);

    // update data when changing to another collection
    useEffect(() => {
        const path = location.pathname.split("/").pop();
        setCollection(path);
    }, [location.pathname]);

    useEffect(() => {
        switch (collection) {
            case "cues":
                getCueCollection()
                    .then((res) => {
                        setData([...res.data, ...res.data, ...res.data, ...res.data, ...res.data]);
                    });
                break;
            case "accessories":
                break;
            case "materials":
                break;
        }

    }, [collection]);
    
    return (
        <div className="collection-page">
            <CollectionBanner collection={collection} />
            <Collection data={data}/>
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