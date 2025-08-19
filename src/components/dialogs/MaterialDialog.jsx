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
    useTheme
} from '@mui/material';
import {
    Close as CloseIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MaterialDialog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [material, setMaterial] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Expose function globally to open dialog
    React.useEffect(() => {
        window.openMaterialDialog = (materialData) => {
            setMaterial(materialData);
            setCurrentImageIndex(0);
            setOpen(true);
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
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 2,
                    maxHeight: isMobile ? '100vh' : '90vh'
                }
            }}
        >
            {material && (
                <>
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
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                            {displayName}
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

            <DialogContent sx={{ p: 0 }}>
                {/* Image Section */}
                {images.length > 0 && (
                    <Box sx={{ position: 'relative', backgroundColor: '#f5f5f5' }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: isMobile ? '250px' : '300px',
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
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
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
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {material.status && (
                            <Chip 
                                label={material.status} 
                                size="small" 
                                color={material.status === 'Available' ? 'success' : 'default'}
                            />
                        )}
                        {material.tier && (
                            <Chip label={material.tier} size="small" variant="outlined" />
                        )}
                        {material.colors && material.colors.length > 0 && (
                            <Chip label={`Colors: ${material.colors.join(', ')}`} size="small" variant="outlined" />
                        )}
                    </Box>

                    {/* Description */}
                    {material.description && (
                        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                            <Typography variant="body1">
                                {material.description}
                            </Typography>
                        </Paper>
                    )}

                    {/* Brief */}
                    {material.brief && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                {material.brief}
                            </Typography>
                        </Box>
                    )}

                    {/* Wood-specific Information */}
                    {isWood && (
                        <>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                                Wood Information
                            </Typography>
                            
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <InfoRow label="Scientific Name" value={material.scientificName} />
                                <InfoRow label="Geographic Origin" value={material.geographicOrigin} />
                                
                                {material.alternateName1 && (
                                    <InfoRow label="Alternate Name" value={material.alternateName1} />
                                )}
                                {material.alternateName2 && (
                                    <InfoRow label="Another Name" value={material.alternateName2} />
                                )}
                                
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
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                                        Metaphysical Properties
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {material.metaphysicalTags.map((tag, index) => (
                                            <Chip key={index} label={tag} size="small" color="primary" variant="outlined" />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </>
                    )}

                    {/* Crystal-specific Information */}
                    {isCrystal && (
                        <>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                                Crystal Information
                            </Typography>
                            
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <InfoRow label="Category" value={material.crystalCategory} />
                            </Grid>

                            {/* Psychological Correspondence for Crystal */}
                            {material.psychologicalCorrespondence && material.psychologicalCorrespondence.length > 0 && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                                        Psychological Correspondence
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {material.psychologicalCorrespondence.map((correspondence, index) => (
                                            <Chip key={index} label={correspondence} size="small" color="primary" variant="outlined" />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </>
                    )}

                    {/* Dates */}
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        <InfoRow 
                            label="Created On" 
                            value={material.createdOn ? new Date(material.createdOn).toLocaleDateString() : null} 
                        />
                        <InfoRow 
                            label="Updated On" 
                            value={material.updatedOn ? new Date(material.updatedOn).toLocaleDateString() : null} 
                        />
                    </Grid>
                </Box>
            </DialogContent>
                </>
            )}
        </Dialog>
    );
};

export default MaterialDialog;
