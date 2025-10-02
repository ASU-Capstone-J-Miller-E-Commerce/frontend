import React from "react";

export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-card-wrapper">
                {/* Skeleton image */}
                <div className="skeleton-card-image">
                    <div className="skeleton-shimmer"></div>
                </div>
                {/* Skeleton content */}
                <div className="skeleton-card-content">
                    {/* Skeleton title */}
                    <div className="skeleton-title">
                        <div className="skeleton-shimmer"></div>
                    </div>
                    {/* Skeleton price */}
                    <div className="skeleton-price">
                        <div className="skeleton-shimmer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}