import React from "react";

import ImageSection from "../sections/ImageSection";
import FeaturedSection from "../sections/FeaturedSection";
import ShopNowSection from "../sections/ShopNowSection";
import MaterialsSection from "../sections/MaterialsSection";
import TestimonialsSection from "../sections/TestimonialsSection";

export default function HomePage() {
    return (
        <div className="homepage-content">
            <ImageSection />
            <FeaturedSection />
            <ShopNowSection />
            <TestimonialsSection />
            <MaterialsSection />
        </div>
    );
}