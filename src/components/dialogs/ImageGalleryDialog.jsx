import React, { useState } from 'react';
import {
    Dialog,
    IconButton,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Dialog state management
let dialogState = {
    setOpen: null,
    setImages: null,
    setCurrentIndex: null,
    setProductName: null
};

// Exported functions for controlling the dialog
export const showImageGallery = (images, currentIndex = 0, productName = '') => {
    if (!dialogState.setOpen) return;
    
    dialogState.setImages(images);
    dialogState.setCurrentIndex(currentIndex);
    dialogState.setProductName(productName);
    dialogState.setOpen(true);
};

export const hideImageGallery = () => {
    if (!dialogState.setOpen) return;
    
    dialogState.setOpen(false);
    dialogState.setImages([]);
    dialogState.setCurrentIndex(0);
    dialogState.setProductName('');
};

const ImageGalleryDialog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [productName, setProductName] = useState('');

    // Register dialog state
    React.useEffect(() => {
        dialogState.setOpen = setOpen;
        dialogState.setImages = setImages;
        dialogState.setCurrentIndex = setCurrentIndex;
        dialogState.setProductName = setProductName;
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleBackdropClick = (e) => {
        // Close dialog if clicking outside of navigation buttons
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!images.length) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={false}
            fullWidth
            fullScreen
            PaperProps={{
                sx: {
                    backgroundColor: '#fff',
                    margin: 0,
                    maxHeight: '100vh',
                    height: '100vh',
                    width: '100vw',
                    borderRadius: 0,
                },
            }}
            sx={{
                '& .MuiDialog-container': {
                    cursor: 'zoom-out'
                }
            }}
        >
            <Box 
                sx={{ 
                    height: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: '#fff',
                    padding: isMobile ? '60px 0 60px 0' : '20px',
                    boxSizing: 'border-box',
                    cursor: 'zoom-out'
                }}
                onClick={handleBackdropClick}
            >
                {/* Close button */}
                <IconButton 
                    onClick={handleClose} 
                    sx={{ 
                        position: 'fixed',
                        top: isMobile ? 10 : 20,
                        right: isMobile ? 10 : 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        color: '#333',
                        zIndex: 1000,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Main Image */}
                <img
                    src={images[currentIndex]}
                    alt={`${productName} - Image ${currentIndex + 1}`}
                    onClick={handleClose}
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: isMobile ? '100vw' : '90vw',
                        maxHeight: isMobile ? 'calc(100vh - 120px)' : '90vh',
                        minWidth: isMobile ? '100vw' : '60vw',
                        minHeight: isMobile ? 'auto' : '60vh',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        cursor: 'zoom-out'
                    }}
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            sx={{
                                position: 'fixed',
                                left: isMobile ? 10 : 20,
                                bottom: isMobile ? 10 : 'auto',
                                top: isMobile ? 'auto' : '50%',
                                transform: isMobile ? 'none' : 'translateY(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                color: '#333',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                                }
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            sx={{
                                position: 'fixed',
                                right: isMobile ? 10 : 20,
                                bottom: isMobile ? 10 : 'auto',
                                top: isMobile ? 'auto' : '50%',
                                transform: isMobile ? 'none' : 'translateY(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                color: '#333',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                                }
                            }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </>
                )}
            </Box>
        </Dialog>
    );
};

export default ImageGalleryDialog;