import React, { useState, useRef, useEffect } from "react";
import { uploadImage } from "../../util/requests";
import { DefaultButton } from "./Buttons";

export function ImageUploader({ onImageUploaded, folder = 'general' }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState({});
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    // Setup drag and drop event listeners
    useEffect(() => {
        const dropZone = dropZoneRef.current;
        if (!dropZone) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDragging) setIsDragging(true);
        };

        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Only set dragging to false if we're leaving the dropzone (not entering a child)
            if (e.currentTarget.contains(e.relatedTarget)) return;
            setIsDragging(false);
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            
            const files = Array.from(e.dataTransfer.files).filter(
                file => file.type.startsWith('image/')
            );
            
            if (files.length > 0) {
                handleFiles(files);
            }
        };

        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragenter', handleDragEnter);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);

        return () => {
            dropZone.removeEventListener('dragover', handleDragOver);
            dropZone.removeEventListener('dragenter', handleDragEnter);
            dropZone.removeEventListener('dragleave', handleDragLeave);
            dropZone.removeEventListener('drop', handleDrop);
        };
    }, [isDragging]);

    const handleFiles = (files) => {
        const newFiles = files.map(file => ({
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file
        }));
        
        // Update selected files
        setSelectedFiles(prev => [...prev, ...newFiles]);
        
        // Generate previews
        const newPreviews = {};
        newFiles.forEach(fileObj => {
            newPreviews[fileObj.id] = URL.createObjectURL(fileObj.file);
        });
        
        setPreviewUrls(prev => ({ ...prev, ...newPreviews }));
    };

    const handleFileSelect = (e) => {
        if (!e.target.files.length) return;
        const files = Array.from(e.target.files);
        handleFiles(files);
        
        // Reset the file input so the same file can be selected again
        e.target.value = '';
    };

    const removeFile = (id) => {
        // Revoke the object URL to prevent memory leaks
        if (previewUrls[id]) {
            URL.revokeObjectURL(previewUrls[id]);
        }
        
        setSelectedFiles(prev => prev.filter(fileObj => fileObj.id !== id));
        setPreviewUrls(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[id];
            return newPreviews;
        });
    };

    const uploadFiles = () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        
        // Track how many uploads have completed
        let completedUploads = 0;
        const uploadedUrls = [];
        
        selectedFiles.forEach(fileObj => {
            // Set initial progress
            setUploadProgress(prev => ({ ...prev, [fileObj.id]: 10 }));
            
            // Upload each file without progress callback
            uploadImage(fileObj.file, folder)
                .then(res => {
                    // Store the uploaded URL
                    uploadedUrls.push(res.data);
                    
                    // Set progress to 100% when complete
                    setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }));
                    
                    // Check if all uploads are finished
                    completedUploads++;
                    if (completedUploads === selectedFiles.length) {
                        // Call the callback with all URLs
                        if (onImageUploaded) {
                            onImageUploaded(uploadedUrls);
                        }
                        
                        // Reset the form
                        setSelectedFiles([]);
                        setPreviewUrls({});
                        setUploadProgress({});
                        setUploading(false);
                    }
                })
                .catch(() => {
                    setUploading(false);
                });
            
            // Simulate progress since we don't have real progress events
            // This provides visual feedback that something is happening
            let simulatedProgress = 10;
            const progressInterval = setInterval(() => {
                simulatedProgress += Math.floor(Math.random() * 10) + 5;
                if (simulatedProgress > 90) {
                    simulatedProgress = 90; // Cap at 90% until actually complete
                    clearInterval(progressInterval);
                }
                setUploadProgress(prev => ({ ...prev, [fileObj.id]: simulatedProgress }));
            }, 500);
            
            // Clear interval if upload completes or fails
            setTimeout(() => clearInterval(progressInterval), 10000); // Safety timeout
        });
    };

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
        }}>
            <div 
                ref={dropZoneRef}
                style={{
                    border: `2px dashed ${isDragging ? '#1d3c5c' : '#ccc'}`,
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging ? 'rgba(29, 60, 92, 0.05)' : '#f9f9f9',
                    marginBottom: '15px',
                    transition: 'all 0.2s ease',
                }}
                onClick={() => fileInputRef.current.click()}
            >
                <div style={{ fontSize: '32px', color: '#1d3c5c', marginBottom: '10px' }}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Drag and drop images here</strong>
                    <br /> or click to select files
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    multiple
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </div>
            
            {selectedFiles.length > 0 && (
                <div>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '10px',
                        marginBottom: '15px'
                    }}>
                        {selectedFiles.map(fileObj => (
                            <div 
                                key={fileObj.id}
                                style={{
                                    position: 'relative',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{ 
                                    position: 'relative',
                                    paddingTop: '75%', // 4:3 aspect ratio
                                }}>
                                    {previewUrls[fileObj.id] && (
                                        <img
                                            src={previewUrls[fileObj.id]}
                                            alt="Preview"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    
                                    {/* Progress overlay */}
                                    {uploading && uploadProgress[fileObj.id] !== undefined && uploadProgress[fileObj.id] < 100 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '18px',
                                            fontWeight: 'bold'
                                        }}>
                                            <div>{uploadProgress[fileObj.id]}%</div>
                                        </div>
                                    )}
                                    
                                    {/* Success indicator */}
                                    {uploading && uploadProgress[fileObj.id] === 100 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0,128,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '24px'
                                        }}>
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    )}
                                </div>
                                
                                {/* File name and size */}
                                <div style={{ 
                                    padding: '6px', 
                                    backgroundColor: 'white',
                                    fontSize: '12px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {fileObj.file.name.length > 20 
                                        ? fileObj.file.name.substring(0, 17) + '...' 
                                        : fileObj.file.name}
                                    <br />
                                    <span style={{ color: '#666' }}>
                                        {(fileObj.file.size / 1024).toFixed(0)} KB
                                    </span>
                                </div>
                                
                                {/* Remove button */}
                                {!uploading && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(fileObj.id);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            padding: 0
                                        }}
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {selectedFiles.length} {selectedFiles.length === 1 ? 'image' : 'images'} selected
                        </div>
                        <div>
                            <DefaultButton
                                text={uploading ? 'Uploading...' : 'Upload Images'}
                                onClick={uploadFiles}
                                disabled={selectedFiles.length === 0 || uploading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function AdminSkeletonLoader() {
    return (
        <div className="skeleton-loader">
            <div className="skeleton-header"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
        </div>
    );
}