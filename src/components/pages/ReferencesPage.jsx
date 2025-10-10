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
            url: "https://linkedin.com/in/ethan-dev",
            email: "ethan@jmillercues.com",
            category: "Backend Developer"
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

    const images = [
        {
            name: "Adobe Stock",
            description: "Professional stock images for crystal and gemstone photography",
            url: "https://stock.adobe.com/",
            category: "Premium Stock"
        },
        {
            name: "Custom Photography",
            description: "Original photography of our materials, products, and crafting processes",
            url: "#",
            category: "Original Content"
        }
    ];

    const additionalResources = [
        {
            name: "American Poolplayers Association (APA)",
            description: "World's largest amateur pool league providing industry standards and regulations",
            url: "https://poolplayers.com/",
            category: "Sports Organization"
        },
        {
            name: "Billiard Congress of America (BCA)",
            description: "Governing body for cue sports in the United States setting equipment standards",
            url: "https://www.bca-pool.com/",
            category: "Sports Organization"
        },
        {
            name: "World Pool-Billiard Association (WPA)",
            description: "International governing body for pool establishing global competition standards",
            url: "https://wpapool.com/",
            category: "International Organization"
        },
        {
            name: "Fine Woodworking Magazine",
            description: "Premier publication for woodworking techniques, tools, and craftsmanship inspiration",
            url: "https://www.finewoodworking.com/",
            category: "Educational Resource"
        },
        {
            name: "Sustainable Forestry Initiative",
            description: "Certification program ensuring responsible sourcing of wood materials",
            url: "https://forests.org/",
            category: "Sustainability"
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
                            <span className="reference-category">{ref.category}</span>
                        </div>
                        <p className="reference-description">{ref.description}</p>
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
                        {ref.url !== "#" && (
                            <a 
                                href={ref.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="reference-link"
                            >
                                <i className="fa-solid fa-external-link-alt"></i>
                                {ref.email ? 'LinkedIn Profile' : 'Visit Website'}
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
                    title="Development Technology" 
                    references={developmentTechnology} 
                />

                <ReferenceSection 
                    title="Images" 
                    references={images} 
                />

                <ReferenceSection 
                    title="Additional Resources" 
                    references={additionalResources} 
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