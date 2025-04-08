import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCueCollection } from "../../util/requests";
import { Card } from "../util/Card";

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
                        setData(res.data);
                    });
                break;
            case "accessories":
                break;
            case "materials":
                break;
        }

    }, [collection]);
    
    return (
        <div>
            {collection}
            <div className="featured-listing">
                <ul>
                    {data.map((item, index) => {
                        console.log(item)
                        return <li key={index}>
                            <Card image={item.imageUrls[0]} title={item.name} price={item.price}/>
                        </li>})}
                </ul>
            </div>
        </div>
    );
}