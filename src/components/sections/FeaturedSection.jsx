import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../util/Card";
import { DefaultButton } from "../util/Buttons";
import { getFeaturedCues } from "../../util/requests";
import { receiveResponse } from "../../util/notifications";

import cue from "../../images/cue.jpg"

export default function FeaturedSection () {
    const navigate = useNavigate();
    const [featuredCues, setFeaturedCues] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        getFeaturedCues()
            .then((response) => {
                if (response && response.data) {
                    setFeaturedCues(response.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    // Don't render section if no featured cues
    if (loading || !featuredCues || featuredCues.length === 0) {
        return null;
    }

    return (
        <section className="featured-section">
            {/* Featured Header */}
            <div className="featured-header-wrapper">
                <h2 className="featured-header-title">
                    Featured Pool Cues
                </h2>
            </div>

            {/* Featured Items */}
            <div className="featured-listing">
                <ul>
                    {featuredCues.map((cueItem) => (
                        <li key={cueItem.guid}>
                            <Card 
                                image={cueItem.imageUrls && cueItem.imageUrls.length > 0 ? cueItem.imageUrls[0] : cue}
                                images={cueItem.imageUrls}
                                title={cueItem.name}
                                price={cueItem.price}
                                tag={cueItem.cueNumber}
                                linkTo={`/cues/${cueItem.guid}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {/* View All */}
            <div className="featured-cta">
                <DefaultButton 
                    text="View All" 
                    onClick={() => navigate('/collections/cues')}
                    className="featured-button-custom"
                />
            </div>
        </section>
    );
}