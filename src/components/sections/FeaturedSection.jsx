import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../util/Card";
import { DefaultButton } from "../util/Buttons";

import cue from "../../images/cue.jpg"

export default function FeaturedSection () {
    const navigate = useNavigate();
    
    // Mock featured cues data - in a real app this would come from props or an API
    const featuredCues = [
        {
            id: "cue-1",
            title: "Handcrafted Maple Cue",
            price: 450.00,
            tag: "FEATURED",
            image: cue,
            linkTo: "/cues/cue-1"
        },
        {
            id: "cue-2", 
            title: "Premium Ebony Cue",
            price: 650.00,
            tag: "PREMIUM",
            image: cue,
            linkTo: "/cues/cue-2"
        },
        {
            id: "cue-3",
            title: "Custom Inlay Design",
            price: 820.00,
            tag: "CUSTOM",
            image: cue,
            linkTo: "/cues/cue-3"
        },
        {
            id: "cue-4",
            title: "Competition Series",
            price: 380.00,
            tag: "SPORT",
            image: cue,
            linkTo: "/cues/cue-4"
        }
    ];

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
                    {featuredCues.map((cue) => (
                        <li key={cue.id}>
                            <Card 
                                image={cue.image} 
                                title={cue.title} 
                                price={cue.price}
                                tag={cue.tag}
                                linkTo={cue.linkTo}
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