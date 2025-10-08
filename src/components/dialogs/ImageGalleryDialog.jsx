import React, { useState } from 'react';
import {
    Dialog,
    IconButton,
    Box,
    useTheme,
    useMediaQuery,
    Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

    if (!images.length) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
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
        >
            <Box sx={{ 
                width: '100vw', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                backgroundColor: '#fff',
                padding: '20px'
            }}>
                {/* Close button */}
                <IconButton 
                    onClick={handleClose} 
                    sx={{ 
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        color: '#333',
                        zIndex: 1000,
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
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        minWidth: '60vw',
                        minHeight: '60vh',
                        objectFit: 'contain',
                        objectPosition: 'center',
                    }}
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <IconButton
                            onClick={prevImage}
                            sx={{
                                position: 'fixed',
                                left: 20,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                color: '#333',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                                }
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton
                            onClick={nextImage}
                            sx={{
                                position: 'fixed',
                                right: 20,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                color: '#333',
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