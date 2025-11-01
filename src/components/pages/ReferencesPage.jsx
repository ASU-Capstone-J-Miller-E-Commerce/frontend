import React from "react";

export default function ReferencesPage() {
    const developmentTeam = [
        {
            name: "Andrew",
            description: "Backend developer specializing in server-side architecture and API development. Focuses on database optimization, security implementation, and scalable backend solutions.",
            url: "https://www.linkedin.com/in/andrewhejl7777/",
            email: "hejlandrew@gmail.com",
            category: "Backend Developer"
        },
        {
            name: "Derek",
            description: "Full-stack developer with expertise in both frontend and backend technologies. Handles end-to-end application development, system integration, and project coordination.",
            url: "https://www.linkedin.com/in/derek-dailey-64118920b",
            email: "derekdailey301@gmail.com",
            category: "Full-Stack Developer"
        },
        {
            name: "Ethan",
            description: "Backend developer focused on server infrastructure and data management. Specializes in API design, database architecture, and backend performance optimization.",
            url: "https://www.linkedin.com/in/ethankeyser",
            email: "ethan.keyser2004@gmail.com",
            category: "Backend Developer"
        }
    ];

    const images = [
        {
            name: "Atlas Billiard Supplies, LLC",
            description: `Atlas Billiard Supplies has supported cue-makers for decades and allowed us to use their stock photos for materials and components, including the Build-A-Cue section. They provide top quality products and excellent customer service.`,
            url: "https://atlassupplies.com/",
            category: "Supplier"
        },
        {
            name: "The Wood Database",
            description: `The Wood Database is an invaluable resource for woodworkers, offering detailed information and photos for nearly any wood type. Their research and images help us present the woods we offer.`,
            url: "https://www.wood-database.com/",
            category: "Educational Resource"
        },
        {
            name: "The African Blackwood Conservation Project",
            description: `Thanks to Bette Stockbauer for use of African Blackwood tree photos and for ongoing conservation and replanting efforts through the African Blackwood Conservation Project.`,
            url: "https://www.blackwoodconservation.org/",
            category: "Conservation"
        }
    ];

    const woodAndCrystal = [
        {
            name: "The Wood Database",
            description: `A top resource for woodworkers and researchers, providing detailed info and photos for nearly any wood type. Their research helps us share wood properties and images on our site.`,
            url: "https://www.wood-database.com/"
        },
        {
            name: "Touch Wood Rings",
            description: `Touch Wood Rings offers insight into the metaphysical and spiritual traits of woods. They craft beautiful rings from consciously selected materials, sharing knowledge about the mystical properties of wood.`,
            url: "https://www.touchwoodrings.com/"
        }
    ];

    // New: Additional Resources as per user prompt
    const additionalResources = [
        {
            name: "The African Blackwood Conservation Project",
            description: "Thanks to Bette Stockbauer for use of African Blackwood tree photos and for ongoing conservation and replanting efforts for the African Blackwood tree.",
            url: "https://www.blackwoodconservation.org/"
        },
        {
            name: "Gruben, Michelle. All about wand woods: Magick and meaning from Alder to Zebrawood. Grove and Grotto.",
            description: "",
            url: "https://www.groveandgrotto.com/blogs/articles/all-about-wand-woods-magick-and-meaning-from-alder-to-zebrawood"
        },
        {
            name: "Buddhist Bracelet. Wood Spiritual Meaning. Buddhist bracelet.",
            description: "",
            url: "https://www.buddhistbracelet.com/blogs/news/wood-spiritual-meaning"
        },
        {
            name: "Urban Stillness. Wood Symbolism. Urbanstillness.",
            description: "",
            url: "https://urbanstillness.com/pages/wood-symbolism"
        },
        {
            name: "Cosmic Punk. Wand crafting series- wood meanings. Amino apps.",
            description: "",
            url: "https://aminoapps.com/c/worldofmagic278/page/blog/wand-crafting-series-wood-meanings/aYD5_8qc0ue1QJv0LbRx5DJdLopkM1ZZwj"
        },
        {
            name: "MacFie’s Wizard Shop. Wood Properties. Macfies.",
            description: "",
            url: "https://www.macfies.com/wood-properties.html"
        },
        {
            name: "Rare Earth Designs. Magic in the Woods. Rare earth designs.",
            description: "",
            url: "https://www.rareearthdesigns.net/magic-woods"
        },
        {
            name: "Everis. Symbolism of Trees: Meanings, Cultural History & Spiritual Significance. Everis.",
            description: "",
            url: "https://www.everisforever.com/articles-tools/memorial-ideas/symbolism-of-trees-meanings-cultural-history-spiritual-significance/"
        },
        {
            name: "Xerri, Semele. Wood Glossary. Triple Moon.",
            description: "",
            url: "https://semelexerri.co.uk/giveaways/wood-glossary/"
        },
        {
            name: "Ciaran1. Magical Properties of Wood for Wands. Spells of Magic.",
            description: "",
            url: "https://www.spellsofmagic.com/coven_ritual.html?ritual=3300&coven=510"
        }
    ];

    const developmentTechnology = [
        {
            name: "React",
            description: "JavaScript library for building user interfaces with component-based architecture",
            url: "https://reactjs.org/",
            category: "Frontend Framework"
        },
        {
            name: "Vite",
            description: "Next generation frontend tooling for fast development and optimized builds",
            url: "https://vitejs.dev/",
            category: "Build Tool"
        },
        {
            name: "Node.js",
            description: "JavaScript runtime built on Chrome's V8 engine for server-side development",
            url: "https://nodejs.org/",
            category: "Runtime Environment"
        },
        {
            name: "Express.js",
            description: "Fast, unopinionated, minimalist web framework for Node.js backend development",
            url: "https://expressjs.com/",
            category: "Backend Framework"
        },
        {
            name: "Font Awesome",
            description: "Comprehensive icon library and toolkit for web development and design",
            url: "https://fontawesome.com/",
            category: "Icon Library"
        }
    ];

    const ReferenceSection = ({ title, references }) => (
        <div className="reference-section">
            <h2>{title}</h2>
            <div className="reference-grid">
                {references.map((ref, index) => (
                    <div key={index} className="reference-card">
                        <div className="reference-header">
                            <h4 className="reference-name">{ref.name}</h4>
                            {ref.category && (
                                <span className="reference-category">{ref.category}</span>
                            )}
                        </div>
                        {ref.description && <p className="reference-description">{ref.description}</p>}
                        {ref.email && (
                            <div className="reference-contact">
                                <a 
                                    href={`mailto:${ref.email}`}
                                    className="reference-link"
                                >
                                    <i className="fa-solid fa-envelope"></i>
                                    {ref.email}
                                </a>
                            </div>
                        )}
                        {ref.url && ref.url !== "#" && (
                            <a 
                                href={ref.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="reference-link"
                            >
                                <i className="fa-solid fa-external-link-alt"></i>
                                Visit Website
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const WoodAndCrystalSection = ({ references }) => (
        <div className="reference-section">
            <h2>Wood and Crystal Properties</h2>
            <div className="reference-grid">
                {references.map((ref, index) => (
                    <div key={index} className="reference-card">
                        <div className="reference-header">
                            <h4 className="reference-name">{ref.name}</h4>
                        </div>
                        <p className="reference-description">{ref.description}</p>
                        {ref.url && (
                            <a 
                                href={ref.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="reference-link"
                            >
                                <i className="fa-solid fa-external-link-alt"></i>
                                Visit Website
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>References</h1>
            </div>
            
            <div className="page-content references-content">
                <div className="references-intro">
                    <p>
                        We believe in transparency and giving credit where it's due. This page acknowledges 
                        the team members, technologies, and resources that have contributed to our success and 
                        continue to support our mission of creating exceptional custom cues.
                    </p>
                </div>

                <ReferenceSection 
                    title="Development Team" 
                    references={developmentTeam} 
                />

                <ReferenceSection 
                    title="Images" 
                    references={images} 
                />

                <WoodAndCrystalSection 
                    references={woodAndCrystal}
                />

                <ReferenceSection 
                    title="Additional Resources" 
                    references={additionalResources} 
                />

                <ReferenceSection 
                    title="Development Technology" 
                    references={developmentTechnology} 
                />

                <div className="references-footer">
                    <h3>Acknowledgments</h3>
                    <p>
                        We extend our gratitude to all the craftsmen, suppliers, and industry professionals 
                        who have shared their knowledge and expertise with us over the years. The cue-making 
                        community is built on tradition, innovation, and mutual respect, and we're honored 
                        to be part of this legacy.
                    </p>
                    <p>
                        If you believe we've missed an important reference or would like to suggest an 
                        addition to this page, please don't hesitate to contact us.
                    </p>
                </div>
            </div>
        </div>
    );
}