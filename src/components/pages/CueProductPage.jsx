import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DefaultButton } from "../util/Buttons";
import { getCueByGuid } from "../../util/requests";
import MaterialLink from "../util/MaterialLink";
import NotFoundPage from "./NotFoundPage";

export default function CueProductPage() {
    const { guid } = useParams();
    const navigate = useNavigate();
    const [cue, setCue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [error, setError] = useState(null);
    const [openSections, setOpenSections] = useState({
        specifications: true,
        materials: false,
        inlays: false,
        points: false,
        rings: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        if (guid) {
            setLoading(true);
            getCueByGuid(guid)
                .then(response => {
                    if (response && response.data) {
                        setCue(response.data);
                    } else {
                        setError("Cue not found");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError("Failed to load cue");
                    console.error("Error fetching cue:", err);
                    setLoading(false);
                })
        }
    }, [guid]);

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const handlePurchase = () => {
        // TODO: Implement purchase functionality
        console.log("Purchase cue:", cue);
    };

    if (loading) {
        return (
            <div className="product-page">
                <div className="product-container">
                    <div className="product-loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (error || !cue) {
        return (
            <NotFoundPage />
        );
    }

    const images = cue.imageUrls || [];
    const hasImages = images.length > 0;
    const hasPrice = cue.price !== undefined && cue.price !== null && cue.price !== "";
    const isAvailable = cue.status === "available";

    return (
        <div className="product-page">
            <div className="product-container">
                {/* Image Gallery */}
                <div className="product-gallery">
                    {hasImages ? (
                        <>
                            <div className="product-main-image">
                                <img 
                                    src={images[currentImageIndex]} 
                                    alt={cue.name}
                                    className="main-image"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="product-thumbnails">
                                    {images.map((image, index) => (
                                        <div 
                                            key={index}
                                            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                            onClick={() => handleImageChange(index)}
                                        >
                                            <img src={image} alt={`${cue.name} view ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="product-no-image">
                            <div className="no-image-placeholder">
                                <i className="fa-solid fa-image"></i>
                                <span>No Image Available</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <div className="product-header">
                        <div className="product-title-section">
                            <span className="product-number">[{cue.cueNumber}]</span>
                            <h1 className="product-title">{cue.name}</h1>
                        </div>
                        {hasPrice && (
                            <div className="product-price">
                                ${Number(cue.price).toFixed(2)}
                            </div>
                        )}
                        <div className={`product-status ${cue.status}`}>
                            {cue.status.charAt(0).toUpperCase() + cue.status.slice(1)}
                        </div>
                    </div>

                    {cue.description && (
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{cue.description}</p>
                        </div>
                    )}

                    {/* Purchase Section */}
                    <div className="product-purchase">
                        {isAvailable && hasPrice ? (
                            <DefaultButton 
                                text={`Purchase for $${Number(cue.price).toFixed(2)}`} 
                                onClick={handlePurchase} 
                            />
                        ) : isAvailable ? (
                            <DefaultButton 
                                text="Contact for Pricing" 
                                onClick={() => navigate("/contact")} 
                            />
                        ) : (
                            <div className="unavailable-notice">
                                This cue is currently {cue.status}.
                            </div>
                        )}
                    </div>

                    {/* Cue Specifications */}
                    <div className="product-specs">
                        <h4 
                            className="section-header" 
                            onClick={() => toggleSection('specifications')}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            Specifications
                            <i className={`fa-solid ${openSections.specifications ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </h4>
                        {openSections.specifications && (
                            <div className="specs-grid">
                                {cue.overallLength && (
                                    <div className="spec-item">
                                        <span className="spec-label">Overall Length:</span>
                                        <span className="spec-value">{cue.overallLength}</span>
                                    </div>
                                )}
                                {cue.overallWeight && (
                                    <div className="spec-item">
                                        <span className="spec-label">Overall Weight:</span>
                                        <span className="spec-value">{cue.overallWeight}</span>
                                    </div>
                                )}
                                {cue.tipSize && (
                                    <div className="spec-item">
                                        <span className="spec-label">Tip Size:</span>
                                        <span className="spec-value">{cue.tipSize}</span>
                                    </div>
                                )}
                                {cue.shaftTaper && (
                                    <div className="spec-item">
                                        <span className="spec-label">Shaft Taper:</span>
                                        <span className="spec-value">{cue.shaftTaper}</span>
                                    </div>
                                )}
                                {cue.jointPinSize && (
                                    <div className="spec-item">
                                        <span className="spec-label">Joint Pin Size:</span>
                                        <span className="spec-value">{cue.jointPinSize}</span>
                                    </div>
                                )}
                                <div className="spec-item">
                                    <span className="spec-label">Butt Type:</span>
                                    <span className="spec-value">{cue.isFullSplice ? 'Full Splice' : 'Standard'}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Handle Wrap:</span>
                                    <span className="spec-value">{cue.includeWrap ? 'Yes' : 'No'}</span>
                                </div>
                                {cue.includeWrap && cue.handleWrapType && (
                                    <div className="spec-item">
                                        <span className="spec-label">Wrap Type:</span>
                                        <span className="spec-value">{cue.handleWrapType}</span>
                                    </div>
                                )}
                                {cue.includeWrap && cue.handleWrapColor && (
                                    <div className="spec-item">
                                        <span className="spec-label">Wrap Color:</span>
                                        <span className="spec-value">{cue.handleWrapColor}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Materials & Construction */}
                    <div className="product-materials">
                        <h4 
                            className="section-header" 
                            onClick={() => toggleSection('materials')}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            Materials & Construction
                            <i className={`fa-solid ${openSections.materials ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </h4>
                        {openSections.materials && (
                            <div className="materials-grid">
                                {cue.shaftMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Shaft Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.shaftMaterial} />
                                        </span>
                                    </div>
                                )}
                                {cue.forearmMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Forearm Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.forearmMaterial} />
                                        </span>
                                    </div>
                                )}
                                {cue.handleMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Handle Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.handleMaterial} />
                                        </span>
                                    </div>
                                )}
                                {cue.buttSleeveMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Butt Sleeve Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.buttSleeveMaterial} />
                                        </span>
                                    </div>
                                )}
                                {cue.ferruleMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Ferrule Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.ferruleMaterial} />
                                        </span>
                                    </div>
                                )}
                                {cue.jointPinMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Joint Pin Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.jointPinMaterial} />
                                        </span>
                                    </div>
                                )}
                                {cue.jointCollarMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Joint Collar Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.jointCollarMaterial} />
                                        </span>
                                    </div>
                                )}
                                {cue.buttCapMaterial && (
                                    <div className="material-item">
                                        <span className="material-label">Butt Cap Material:</span>
                                        <span className="material-value">
                                            <MaterialLink material={cue.buttCapMaterial} />
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Inlays */}
                    {(cue.forearmInlayMaterial || cue.handleInlayMaterial || cue.buttsleeveInlayMaterial) && (
                        <div className="product-inlays">
                            <h4 
                                className="section-header" 
                                onClick={() => toggleSection('inlays')}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                Inlays
                                <i className={`fa-solid ${openSections.inlays ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </h4>
                            {openSections.inlays && (
                                <div className="details-grid">
                                    {cue.forearmInlayMaterial && (
                                        <div className="detail-section">
                                            <h4>Forearm Inlays</h4>
                                            <div className="detail-item">
                                                <span className="detail-label">Material:</span>
                                                <span className="detail-value">
                                                    <MaterialLink material={cue.forearmInlayMaterial} />
                                                </span>
                                            </div>
                                            {cue.forearmInlayQuantity && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Quantity:</span>
                                                    <span className="detail-value">{cue.forearmInlayQuantity}</span>
                                                </div>
                                            )}
                                            {cue.forearmInlaySize && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Size:</span>
                                                    <span className="detail-value">{cue.forearmInlaySize}</span>
                                                </div>
                                            )}
                                            {cue.forearmInlayDescription && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Description:</span>
                                                    <span className="detail-value">{cue.forearmInlayDescription}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {cue.handleInlayMaterial && (
                                        <div className="detail-section">
                                            <h4>Handle Inlays</h4>
                                            <div className="detail-item">
                                                <span className="detail-label">Material:</span>
                                                <span className="detail-value">
                                                    <MaterialLink material={cue.handleInlayMaterial} />
                                                </span>
                                            </div>
                                            {cue.handleInlayQuantity && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Quantity:</span>
                                                    <span className="detail-value">{cue.handleInlayQuantity}</span>
                                                </div>
                                            )}
                                            {cue.handleInlaySize && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Size:</span>
                                                    <span className="detail-value">{cue.handleInlaySize}</span>
                                                </div>
                                            )}
                                            {cue.handleInlayDescription && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Description:</span>
                                                    <span className="detail-value">{cue.handleInlayDescription}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {cue.buttsleeveInlayMaterial && (
                                        <div className="detail-section">
                                            <h4>Butt Sleeve Inlays</h4>
                                            <div className="detail-item">
                                                <span className="detail-label">Material:</span>
                                                <span className="detail-value">
                                                    <MaterialLink material={cue.buttSleeveInlayMaterial} />
                                                </span>
                                            </div>
                                            {cue.buttsleeveInlayQuantity && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Quantity:</span>
                                                    <span className="detail-value">{cue.buttsleeveInlayQuantity}</span>
                                                </div>
                                            )}
                                            {cue.buttsleeveInlaySize && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Size:</span>
                                                    <span className="detail-value">{cue.buttsleeveInlaySize}</span>
                                                </div>
                                            )}
                                            {cue.buttsleeveInlayDescription && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Description:</span>
                                                    <span className="detail-value">{cue.buttsleeveInlayDescription}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Points */}
                    {(cue.forearmPointQuantity || cue.buttSleevePointQuantity) && (
                        <div className="product-points">
                            <h4 
                                className="section-header" 
                                onClick={() => toggleSection('points')}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                Points
                                <i className={`fa-solid ${openSections.points ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </h4>
                            {openSections.points && (
                                <div className="details-grid">
                                    {cue.forearmPointQuantity && (
                                        <div className="detail-section">
                                            <h4>Forearm Points</h4>
                                            <div className="detail-item">
                                                <span className="detail-label">Quantity:</span>
                                                <span className="detail-value">{cue.forearmPointQuantity}</span>
                                            </div>
                                            {cue.forearmPointSize && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Size:</span>
                                                    <span className="detail-value">{cue.forearmPointSize}</span>
                                                </div>
                                            )}
                                            {cue.forearmPointVeneerDescription && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Veneer:</span>
                                                    <span className="detail-value">{cue.forearmPointVeneerDescription}</span>
                                                </div>
                                            )}
                                            {cue.forearmPointInlayMaterial && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Inlay Material:</span>
                                                    <span className="detail-value">
                                                        <MaterialLink material={cue.forearmPointInlayMaterial} />
                                                    </span>
                                                </div>
                                            )}
                                            {cue.forearmPointInlayDescription && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Inlay Description:</span>
                                                    <span className="detail-value">{cue.forearmPointInlayDescription}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {cue.buttSleevePointQuantity && (
                                        <div className="detail-section">
                                            <h4>Butt Sleeve Points</h4>
                                            <div className="detail-item">
                                                <span className="detail-label">Quantity:</span>
                                                <span className="detail-value">{cue.buttSleevePointQuantity}</span>
                                            </div>
                                            {cue.buttSleevePointSize && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Size:</span>
                                                    <span className="detail-value">{cue.buttSleevePointSize}</span>
                                                </div>
                                            )}
                                            {cue.buttSleevePointVeneerDescription && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Veneer:</span>
                                                    <span className="detail-value">{cue.buttSleevePointVeneerDescription}</span>
                                                </div>
                                            )}
                                            {cue.buttSleevePointInlayMaterial && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Inlay Material:</span>
                                                    <span className="detail-value">
                                                        <MaterialLink material={cue.buttSleevePointInlayMaterial} />
                                                    </span>
                                                </div>
                                            )}
                                            {cue.buttSleevePointInlayDescription && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Inlay Description:</span>
                                                    <span className="detail-value">{cue.buttSleevePointInlayDescription}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rings */}
                    {(cue.ringsDescription || cue.ringType) && (
                        <div className="product-rings">
                            <h4 
                                className="section-header" 
                                onClick={() => toggleSection('rings')}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                Rings
                                <i className={`fa-solid ${openSections.rings ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </h4>
                            {openSections.rings && (
                                <div className="details-grid">
                                    <div className="detail-section">
                                        {cue.ringType && (
                                            <div className="detail-item">
                                                <span className="detail-label">Type:</span>
                                                <span className="detail-value">{cue.ringType}</span>
                                            </div>
                                        )}
                                        {cue.ringsDescription && (
                                            <div className="detail-item">
                                                <span className="detail-label">Description:</span>
                                                <span className="detail-value">{cue.ringsDescription}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
