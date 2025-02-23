import React from "react";

import ImageSection from "../sections/ImageSection";
import FeaturedSection from "../sections/FeaturedSection";
import ShopNowSection from "../sections/ShopNowSection";
import TestimonialsSection from "../sections/TestimonialsSection";

export default function HomePage() {
    return (
        <>
            <ImageSection />
            <FeaturedSection />
            <ShopNowSection />
            <TestimonialsSection />
            <ShopNowSection />
        </>
    );
}