import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card } from "../util/Card";
import { SkeletonCard } from "../util/SkeletonCard";
import { DefaultButton } from "../util/Buttons";

export default function FeaturedSection() {
    const navigate = useNavigate();
    const { items: featuredCues, loading } = useSelector(state => state.featuredCues);

    // Don't render section if no featured cues and not loading
    if (!loading && (!featuredCues || featuredCues.length === 0)) {
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
                    {loading ? (
                        // Show 4 skeleton cards while loading
                        Array.from({ length: 4 }, (_, index) => (
                            <li key={`skeleton-${index}`}>
                                <SkeletonCard />
                            </li>
                        ))
                    ) : (
                        featuredCues.map((cueItem) => (
                            <li key={cueItem.guid}>
                                <Card
                                    image={cueItem.imageUrls[0]}
                                    images={cueItem.imageUrls}
                                    title={cueItem.name}
                                    price={cueItem.price}
                                    tag={cueItem.cueNumber}
                                    linkTo={`/cues/${cueItem.guid}`}
                                />
                            </li>
                        ))
                    )}
                </ul>
            </div>

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