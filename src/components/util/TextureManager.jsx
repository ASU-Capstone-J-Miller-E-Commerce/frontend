import React, { useState, useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei';

const TEXTURE_LIBRARY = {
    birdseyeShaft:{
        map: '../textures/shaft/birdseye-maple/birdseye-maple.png',
        roughnessMap: '../textures/shaft/birdseye-maple/birdseye-maple-roughness.png',
        normalMap: '../textures/shaft/birdseye-maple/birdseye-maple-normal.png'
    },
    purpleheartShaft:{
        map: '../textures/shaft/purpleheart/purpleheart.png',
        roughnessMap: '../textures/shaft/purpleheart/purpleheart-roughness.png',
        normalMap: '../textures/shaft/purpleheart/purpleheart-normal.png'
    },
    carbonfiberShaft:{
        map: '../textures/shaft/carbon-fiber/carbon-fiber.png',
        roughnessMap: '../textures/shaft/carbon-fiber/carbon-fiber-roughness.png',
        normalMap: '../textures/shaft/carbon-fiber/carbon-fiber-normal.png'
    },
    africanBlackwoodForearm:{
        map: '../textures/forearm/african-blackwood/african-blackwood.png',
        roughnessMap: '../textures/forearm/african-blackwood/african-blackwood-roughness.png',
        normalMap: '../textures/forearm/african-blackwood/african-blackwood-normal.png'
    },
    amboynaBurlForearm:{
        map: '../textures/forearm/amboyna-burl/amboyna-burl.png',
        roughnessMap: '../textures/forearm/amboyna-burl/amboyna-burl-roughness.png',
        normalMap: '../textures/forearm/amboyna-burl/amboyna-burl-normal.png'
    },
    bloodwoodForearm:{
        map: '../textures/forearm/bloodwood/bloodwood.png',
        roughnessMap: '../textures/forearm/bloodwood/bloodwood-roughness.png',
        normalMap: '../textures/forearm/bloodwood/bloodwood-normal.png'
    },
    blueMahoeForearm:{
        map: '../textures/forearm/blue-mahoe/blue-mahoe.png',
        roughnessMap: '../textures/blue-mahoe/blue-mahoe-roughness.png',
        normalMap: '../textures/blue-mahoe/blue-mahoe-normal.png'
    },
    bocoteForearm:{
        map: '../textures/forearm/bocote/bocote.png',
        roughnessMap: '../textures/bocote/bocote-roughness.png',
        normalMap: '../textures/bocote/bocote-normal.png'
    },
    bubingaFiguredForearm:{
        map: '../textures/forearm/bubinga-figured/bubinga-figured.png',
        roughnessMap: '../textures/bubinga-figured/bubinga-figured-roughness.png',
        normalMap: '../textures/bubinga-figured/bubinga-figured-normal.png'
    }       
};

export function useTextureLibrary() {
    const loadedTextures = {};

    for(const name in TEXTURE_LIBRARY){
        const textures = useTexture(Object.values(TEXTURE_LIBRARY[name]));

        const textureSet = {};
        Object.keys(TEXTURE_LIBRARY[name]).forEach((key, index) => {
            textureSet[key] = textures[index];
        });
        
        loadedTextures[name] = textureSet;
    }
    return loadedTextures;
}