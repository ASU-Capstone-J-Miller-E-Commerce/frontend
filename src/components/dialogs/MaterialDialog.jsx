import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Slide,
    Box,
    Typography,
    Chip,
    Divider,
    Paper,
    Grid,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Close as CloseIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { getWoodByGuid, getCrystalByGuid } from '../../util/requests';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MaterialDialog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [material, setMaterial] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Expose function globally to open dialog
    React.useEffect(() => {
        window.openMaterialDialog = async (materialData) => {
            setOpen(true);
            setCurrentImageIndex(0);
            setLoading(true);
            setError(null);
            setMaterial(null);

            try {
                let fullMaterialData;
                
                // Check if we have a full material object or just basic info with GUID
                if (materialData.commonName || materialData.crystalName) {
                    // If we have the name fields, this might be full data already
                    // But we still want to fetch fresh data from backend
                    const isWood = Boolean(materialData.commonName);
                    const guid = materialData.guid;
                    
                    if (isWood) {
                        const response = await getWoodByGuid(guid);
                        fullMaterialData = response.data;
                    } else {
                        const response = await getCrystalByGuid(guid);
                        fullMaterialData = response.data;
                    }
                } else {
                    // Try to determine type and fetch accordingly
                    // First try as wood, then as crystal if that fails
                    try {
                        const response = await getWoodByGuid(materialData.guid);
                        fullMaterialData = response.data;
                    } catch (woodError) {
                        try {
                            const response = await getCrystalByGuid(materialData.guid);
                            fullMaterialData = response.data;
                        } catch (crystalError) {
                            throw new Error('Material not found');
                        }
                    }
                }
                
                setMaterial(fullMaterialData);
            } catch (err) {
                console.error('Error fetching material:', err);
                setError('Failed to load material details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        
        return () => {
            delete window.openMaterialDialog;
        };
    }, []);

    // Reset image index when material changes
    React.useEffect(() => {
        if (material) {
            setCurrentImageIndex(0);
        }
    }, [material]);

    const handleClose = () => {
        setOpen(false);
        setMaterial(null);
        setLoading(false);
        setError(null);
    };

    // Determine if it's wood or crystal based on properties (with null checks)
    const isWood = material ? Boolean(material.commonName) : false;
    const isCrystal = material ? Boolean(material.crystalName) : false;

    // Get the display name
    const displayName = material ? (isWood ? material.commonName : material.crystalName) : '';

    // Handle image navigation
    const images = material ? (material.imageUrls || []) : [];
    const hasMultipleImages = images.length > 1;

    const nextImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (hasMultipleImages) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    const InfoRow = ({ label, value, fullWidth = false }) => {
        if (!value) return null;
        
        return (
            <Grid item xs={fullWidth ? 12 : 6}>
                <Box>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        fontFamily: "'bouwsma-uncial', serif !important",
                        fontSize: '1.2rem',
                        color: 'black'
                    }}>
                        {label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important",
                        fontSize: '1.2rem'
                    }}>
                        {Array.isArray(value) ? value.join(', ') : value}
                    </Typography>
                </Box>
            </Grid>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="lg"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 2,
                    maxHeight: isMobile ? '100vh' : '95vh',
                    width: isMobile ? '100%' : '85vw',
                },
                className: 'miller-dialog-typography'
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Typography variant="h4" component="h2" sx={{ 
                    fontWeight: 600,
                    fontFamily: "'bouwsma-uncial', serif !important"
                }}>
                    {loading ? 'Loading...' : error ? 'Error' : displayName}
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Box sx={{ p: 3 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {!loading && !error && material && (
                    <>
                        {/* Image Section */}
                        {images.length > 0 && (
                            <Box sx={{ position: 'relative', backgroundColor: '#f5f5f5' }}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: isMobile ? '300px' : '400px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={images[currentImageIndex]}
                                        alt={`${displayName} - Image ${currentImageIndex + 1}`}
                                        style={{
                                            maxWidth: '90%',
                                            maxHeight: '90%',
                                            objectFit: 'contain',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    
                                    {/* Image Navigation */}
                                    {hasMultipleImages && (
                                        <>
                                            <IconButton
                                                onClick={prevImage}
                                                sx={{
                                                    position: 'absolute',
                                                    left: 8,
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                                    }
                                                }}
                                            >
                                                <ChevronLeftIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={nextImage}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 8,
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                                    }
                                                }}
                                            >
                                                <ChevronRightIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>

                                {/* Image Counter */}
                                {hasMultipleImages && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {currentImageIndex + 1} / {images.length}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Content Section */}
                        <Box sx={{ p: 3 }}>
                            {/* Status and Tier */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                {material.status && (
                                    <Chip 
                                        label={material.status} 
                                        size="small" 
                                        color={material.status === 'Available' ? 'success' : 'default'}
                                        sx={{ 
                                            fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important", 
                                            fontSize: '0.9rem',
                                            '& .MuiChip-label': {
                                                fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important"
                                            }
                                        }}
                                    />
                                )}
                                {material.tier && (
                                    <Chip 
                                        label={material.tier} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ 
                                            fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important", 
                                            fontSize: '0.9rem',
                                            '& .MuiChip-label': {
                                                fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important"
                                            }
                                        }}
                                    />
                                )}
                                {material.colors && material.colors.length > 0 && (
                                    <Chip 
                                        label={`Colors: ${material.colors.join(', ')}`} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ 
                                            fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important", 
                                            fontSize: '0.9rem',
                                            '& .MuiChip-label': {
                                                fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important"
                                            }
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Brief */}
                            {material.brief && (
                                <>
                                    <Typography variant="h6" gutterBottom sx={{ 
                                        fontWeight: 600, 
                                        mb: 1,
                                        fontFamily: "'bouwsma-uncial', serif !important",
                                        color: 'black'
                                    }}>
                                        Brief Overview
                                    </Typography>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body1" color="text.secondary" sx={{ 
                                            fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important", 
                                            fontSize: '1.1rem',
                                            '& *': {
                                                fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important"
                                            }
                                        }}>
                                            {material.brief}
                                        </Typography>
                                    </Box>
                                </>
                            )}

                            {/* Description */}
                            {material.description && (
                                <>
                                    <Typography variant="h6" gutterBottom sx={{ 
                                        fontWeight: 600, 
                                        mb: 1,
                                        fontFamily: "'bouwsma-uncial', serif !important",
                                        color: 'black'
                                    }}>
                                        Description
                                    </Typography>
                                    <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                                        <Typography variant="body1" sx={{ 
                                            fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important", 
                                            fontSize: '1.1rem',
                                            '& *': {
                                                fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important"
                                            }
                                        }}>
                                            {material.description}
                                        </Typography>
                                    </Paper>
                                </>
                            )}

                            {/* Wood-specific Information */}
                            {isWood && (
                                <>
                                    {/* Basic Wood Information */}
                                    <Typography variant="h5" gutterBottom sx={{ 
                                        fontWeight: 600,
                                        fontFamily: "'bouwsma-uncial', serif !important",
                                        mb: 1,
                                        color: 'black'
                                    }}>
                                        Wood Specifications
                                    </Typography>
                                    
                                    <Grid container spacing={3} sx={{ mb: 3 }}>
                                        <InfoRow label="Scientific Name" value={material.scientificName} />
                                        <InfoRow label="Geographic Origin" value={material.geographicOrigin} />
                                        
                                        {material.alternateName1 && (
                                            <InfoRow label="Alternate Name" value={material.alternateName1} />
                                        )}
                                        {material.alternateName2 && (
                                            <InfoRow label="Another Name" value={material.alternateName2} />
                                        )}
                                    </Grid>

                                    {/* Physical Properties */}
                                    <Typography variant="h6" gutterBottom sx={{ 
                                        fontWeight: 600,
                                        fontFamily: "'bouwsma-uncial', serif !important",
                                        mb: 1,
                                        color: 'black'
                                    }}>
                                        Physical Properties
                                    </Typography>
                                    
                                    <Grid container spacing={3} sx={{ mb: 3 }}>
                                        <InfoRow label="Janka Hardness" value={material.jankaHardness} />
                                        <InfoRow label="Tree Height" value={material.treeHeight} />
                                        <InfoRow label="Trunk Diameter" value={material.trunkDiameter} />
                                        <InfoRow label="Texture" value={material.texture} />
                                        <InfoRow label="Grain Pattern" value={material.grainPattern} />
                                        <InfoRow label="Streaks & Veins" value={material.streaksVeins} fullWidth />
                                    </Grid>

                                    {/* Metaphysical Properties for Wood */}
                                    {material.metaphysicalTags && material.metaphysicalTags.length > 0 && (
                                        <>
                                            <Typography variant="h6" gutterBottom sx={{ 
                                                fontWeight: 600,
                                                fontFamily: "'bouwsma-uncial', serif !important",
                                                mb: 1,
                                                color: 'black'
                                            }}>
                                                Metaphysical Properties
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                                {material.metaphysicalTags.map((tag, index) => (
                                                    <Chip 
                                                        key={index} 
                                                        label={tag} 
                                                        size="small" 
                                                        variant="outlined" 
                                                        sx={{ 
                                                            fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important", 
                                                            fontSize: '0.9rem',
                                                            '& .MuiChip-label': {
                                                                fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important"
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}

                            {/* Crystal-specific Information */}
                            {isCrystal && (
                                <>
                                    <Typography variant="h5" gutterBottom sx={{ 
                                        fontWeight: 600,
                                        fontFamily: "'bouwsma-uncial', serif !important",
                                        mb: 1,
                                        color: 'black'
                                    }}>
                                        Crystal Specifications
                                    </Typography>
                                    
                                    <Grid container spacing={3} sx={{ mb: 3 }}>
                                        <InfoRow label="Category" value={material.crystalCategory} />
                                        
                                        {/* Show psychological correspondence adjacent to category if it exists */}
                                        {material.psychologicalCorrespondence && material.psychologicalCorrespondence.length > 0 && (
                                            <InfoRow 
                                                label="Psychological Correspondence" 
                                                value={material.psychologicalCorrespondence.join(', ')} 
                                                fullWidth={!material.crystalCategory}
                                            />
                                        )}
                                    </Grid>
                                </>
                            )}

                            {/* Last Updated */}
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 600,
                                    fontFamily: "'bouwsma-uncial', serif !important",
                                    color: 'black'
                                }}>
                                    Last Updated:
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    fontFamily: "'VTGoblinHand', system-ui, Helvetica, Arial, sans-serif !important",
                                    fontSize: '1.2rem'
                                }}>
                                    {material.updatedOn ? new Date(material.updatedOn).toLocaleDateString() : 'Unknown'}
                                </Typography>
                            </Box>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MaterialDialog;
