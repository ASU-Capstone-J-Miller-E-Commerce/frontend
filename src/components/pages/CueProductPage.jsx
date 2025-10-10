import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DefaultButton } from "../util/Buttons";
import { getCueByGuid, addToCart } from "../../util/requests";
import { addCartItemRedux } from "../../util/redux/actionCreators";
import MaterialLink from "../util/MaterialLink";
import NotFoundPage from "./NotFoundPage";
import { NavLink } from "react-router-dom";
import { receiveErrors, receiveLogs, receiveResponse } from "../../util/notifications";
import { showImageGallery } from "../dialogs/ImageGalleryDialog";

function SectionDropdown({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const contentRef = React.useRef(null);
    
    return (
        <div className="section-dropdown">
            <h4
                className="section-header"
                onClick={() => setOpen(o => !o)}
            >
                <span className="section-title">{title}</span>
                <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </h4>
            <div 
                className={`section-content-wrapper ${open ? 'open' : 'closed'}`}
                style={{
                    maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px'
                }}
            >
                <div className="section-content" ref={contentRef}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function CueProductPage() {
    const { guid } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => !!state.user?.authenticated);
    const [cue, setCue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
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

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            receiveErrors("Please log in to add items to your cart");
            navigate("/login");
            return;
        }

        setAddingToCart(true);
        
        // Add to cart on backend first
        addToCart(cue.guid, 'cue', 1)
            .then((res) => {
                receiveResponse(res);
                
                // Update Redux with the new cart item after successful backend operation
                const cartItem = {
                    itemGuid: cue.guid,
                    itemType: 'cue',
                    quantity: 1, // Cues are always quantity 1
                    addedAt: new Date().toISOString(), // Use ISO string for serialization
                    itemDetails: cue
                };
                
                addCartItemRedux(cartItem);
                setAddingToCart(false);
            })
            .catch((error) => {
                setAddingToCart(false);
            });
    };

    const handleImageInspect = () => {
        if (images.length > 0) {
            showImageGallery(images, currentImageIndex, cue.name);
        }
    };

    if (loading) {
        return (
            <div className="product-skeleton">
                <div className="product-skeleton-container">
                    {/* Skeleton Gallery */}
                    <div className="product-skeleton-gallery">
                        <div className="product-skeleton-main-image"></div>
                        <div className="product-skeleton-thumbnails">
                            <div className="skeleton-thumbnail"></div>
                            <div className="skeleton-thumbnail"></div>
                            <div className="skeleton-thumbnail"></div>
                            <div className="skeleton-thumbnail"></div>
                        </div>
                    </div>

                    {/* Skeleton Product Info */}
                    <div className="product-skeleton-info">
                        <div className="skeleton-product-number"></div>
                        <div className="skeleton-product-title"></div>
                        <div className="skeleton-product-price"></div>
                        <div className="skeleton-product-status"></div>
                        <div className="skeleton-product-description"></div>
                        <div className="skeleton-purchase-section"></div>

                        {/* Skeleton Sections */}
                        <div className="skeleton-section">
                            <div className="skeleton-section-header">
                                <div className="skeleton-section-title"></div>
                                <div className="skeleton-section-icon"></div>
                            </div>
                            <div className="skeleton-specs-grid">
                                <div className="skeleton-spec-item">
                                    <div className="skeleton-spec-label"></div>
                                    <div className="skeleton-spec-value"></div>
                                </div>
                                <div className="skeleton-spec-item">
                                    <div className="skeleton-spec-label"></div>
                                    <div className="skeleton-spec-value"></div>
                                </div>
                                <div className="skeleton-spec-item">
                                    <div className="skeleton-spec-label"></div>
                                    <div className="skeleton-spec-value"></div>
                                </div>
                            </div>
                        </div>

                        <div className="skeleton-section">
                            <div className="skeleton-section-header">
                                <div className="skeleton-section-title"></div>
                                <div className="skeleton-section-icon"></div>
                            </div>
                            <div className="skeleton-specs-grid">
                                <div className="skeleton-spec-item">
                                    <div className="skeleton-spec-label"></div>
                                    <div className="skeleton-spec-value"></div>
                                </div>
                                <div className="skeleton-spec-item">
                                    <div className="skeleton-spec-label"></div>
                                    <div className="skeleton-spec-value"></div>
                                </div>
                            </div>
                        </div>

                        <div className="skeleton-section">
                            <div className="skeleton-section-header">
                                <div className="skeleton-section-title"></div>
                                <div className="skeleton-section-icon"></div>
                            </div>
                        </div>
                    </div>
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
    const isAvailable = cue.status === "Available";


    return (
        <div className="product-page">
            <div className="product-container">
                {/* Image Gallery */}
                <div className="product-gallery">
                    {hasImages ? (
                        <>
                            <div className="product-main-image" onClick={handleImageInspect}>
                                <img 
                                    src={images[currentImageIndex]} 
                                    alt={cue.name}
                                    className="main-image"
                                />
                                {/* Image Inspect Button */}
                                <button 
                                    className="image-inspect-btn-outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImageInspect();
                                    }}
                                    title="View full-size images"
                                >
                                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                                </button>
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
                        <div>
                            <span className="product-number">[{cue.cueNumber}]</span>
                            <h1 className="product-title">{cue.name}</h1>
                        </div>
                        {hasPrice && (
                            <div className="product-price">
                                ${Number(cue.price).toFixed(2)} USD
                            </div>
                        )}
                        <div className="product-status-row">
                            <div className={`product-status ${cue.status.replace(/\s+/g, '-')}`}>
                                {cue.status}
                            </div>
                            {cue.featured && (
                                <div className="product-featured">
                                    <i className="fa-solid fa-star"></i>
                                    Featured
                                </div>
                            )}
                        </div>
                    </div>

                    {cue.description && (
                        <div className="product-description">
                            <p className="description-text">{cue.description}</p>
                        </div>
                    )}

                    {/* Purchase Section */}
                    <div className="product-purchase">
                        {isAvailable && hasPrice ? (
                            <DefaultButton 
                                text={addingToCart ? "Adding to Cart..." : "Add to Cart"}
                                onClick={handlePurchase} 
                                className="full-width-btn"
                                disabled={addingToCart}
                            />
                        ) : isAvailable ? (
                            <DefaultButton 
                                text="Contact for Pricing" 
                                onClick={() => navigate("/pages/contact-us")} 
                                className="full-width-btn"
                            />
                        ) : cue.status === "Coming Soon" ? (
                            <div className="unavailable-notice yellow-notice">
                                This cue is coming soon. <NavLink to="/pages/contact-us" className="contact-link">Contact us</NavLink> for more details!
                            </div>
                        ) : (
                            <div className="unavailable-notice">
                                This cue is currently {cue.status}.
                            </div>
                        )}
                    </div>

                    {/* Cue Specifications */}
                    <SectionDropdown title="Specifications" defaultOpen={true}>
                        <div className="specs-grid">
                            {cue.overallLength && (
                                <div className="spec-item">
                                    <span className="spec-label">Overall Length:</span>
                                    <span className="spec-value">{cue.overallLength} in</span>
                                </div>
                            )}
                            {cue.overallWeight && (
                                <div className="spec-item">
                                    <span className="spec-label">Overall Weight:</span>
                                    <span className="spec-value">{cue.overallWeight} oz</span>
                                </div>
                            )}
                            {cue.tipSize && (
                                <div className="spec-item">
                                    <span className="spec-label">Tip Size:</span>
                                    <span className="spec-value">{cue.tipSize} mm</span>
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
                    </SectionDropdown>

                    <SectionDropdown title="Materials & Construction">
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
                    </SectionDropdown>

                    {(cue.forearmInlayMaterial || cue.handleInlayMaterial || cue.buttsleeveInlayMaterial) && (
                        <SectionDropdown title="Inlays">
                            <div className="details-grid">
                                {cue.forearmInlayMaterial && (
                                    <div className="detail-section">
                                        <h4 className="subsection-header">Forearm Inlays</h4>
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
                                        <h4 className="subsection-header">Handle Inlays</h4>
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
                                        <h4 className="subsection-header">Butt Sleeve Inlays</h4>
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
                        </SectionDropdown>
                    )}

                    {(cue.forearmPointQuantity || cue.buttSleevePointQuantity) && (
                        <SectionDropdown title="Points">
                            <div className="details-grid">
                                {cue.forearmPointQuantity && (
                                    <div className="detail-section">
                                        <h4 className="subsection-header">Forearm Points</h4>
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
                                        <h4 className="subsection-header">Butt Sleeve Points</h4>
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
                        </SectionDropdown>
                    )}

                    {(cue.ringsDescription || cue.ringType) && (
                        <SectionDropdown title="Rings">
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
                        </SectionDropdown>
                    )}
                </div>
            </div>
        </div>
    );
}
