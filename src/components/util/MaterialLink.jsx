import React from 'react';
import { showMaterialDialog } from '../dialogs/MaterialDialog';

const MaterialLink = ({ material, className = '' }) => {
    // Handle different material formats
    const getMaterialInfo = () => {
        if (!material) return { name: null, guid: null };
        
        if (typeof material === 'string') {
            // Just a string - could be a material name or GUID
            return { name: material, guid: null };
        }
        
        if (typeof material === 'object') {
            // Material object with guid and name
            const name = material.commonName || material.crystalName || material.name;
            const guid = material.guid;
            return { name, guid };
        }
        
        return { name: null, guid: null };
    };

    const { name, guid } = getMaterialInfo();

    // If no name, don't render anything
    if (!name) return null;

    // If no GUID, just display the name as text (no link)
    if (!guid) {
        return (
            <span className={`material-text ${className}`}>
                {name}
            </span>
        );
    }

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMaterialDialog(material);
    };

    return (
        <span className={`material-link-container ${className}`}>
            <span 
                className="material-link"
                onClick={handleClick}
                style={{
                    color: '#333',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginRight: '6px'
                }}
            >
                {name}
            </span>
            <i 
                className="fas fa-info-circle material-info-icon"
                onClick={handleClick}
                style={{
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '0.85em',
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
                title={`View details for ${name}`}
            />
        </span>
    );
};

export default MaterialLink;