import React from "react";
import { Card } from "../util/Card";

import cue from "../../images/cue.jpg"

export default function FeaturedSection () {

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
                    <li>
                        <Card image={cue} title={"Pool Cue"} price={500.00}/>
                    </li>
                    <li>
                        <Card image={cue} title={"Pool Cue"} price={500.00} />
                    </li>
                    <li>
                        <Card image={cue} title={"Pool Cue"} price={500.00} />
                    </li>
                    <li>
                        <Card image={cue} title={"Pool Cue"} price={500.00} />
                    </li>
                </ul>
            </div>

            {/* View All */}
            <div>
                <button>
                    View All
                </button>
                
            </div>
            <button>
                View All
            </button>
        </section>
    );
}