import React from "react";
import { Card } from "./Card";

export default function Collection({ data=[] }) {
    return (
        <div className="collection-wrapper">

        
            <div className="collection-listing">
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