import React, { useRef } from "react";
import { useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import "../../css/buttons.css";
import { FullSpliceCue } from "../util/FullSpliceCue";
import { StandardCue } from "../util/StandardCue";

// Model map definition
const models = {
    model1: StandardCue,
    model2: FullSpliceCue,
};

export default function BuildACuePage() {
    const orbitRef = useRef(null);

    // Used to switch between models
    const [activeModel, setActiveModel] = useState('model1');
    const ActiveModelComponent = models[activeModel];

    //buttons
    const zoomIn = () => {
        const controls = orbitRef.current;
        controls.dollyOut(1.1);
        controls.update();
    };

    const zoomOut = () => {
        const controls = orbitRef.current;
        controls.dollyIn(1.1);
        controls.update();
    };

    const resetView = () => {
        const controls = orbitRef.current;
        controls.reset();
    };

// Render scene with the pool cue model
    return (
        <div className="BuildACue" style={{ display: "flex", flexDirection: "column" }}>
            <div className="BuildACueDisplay" style={{ flex: "1"}}>
                <Canvas 
                    camera={{ position: [1500, 1000, 0], fov: 400, near: 0.000001, far: 5000 }}
                    orthographic={true}
                    style={{ height: "100%" }}>

                    <OrbitControls ref={orbitRef} maxZoom={6} minZoom={0.5} minDistance={2} />
                    <ambientLight intensity={4.0} />
                    <directionalLight castShadow position={[1000, 1000, 0]} shadow-mapSize={[1024,1024]} 
                        color='white' intensity={2.0}>
                        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
                    </directionalLight>
                  
                        {ActiveModelComponent && <ActiveModelComponent />}

                </Canvas>
                <div className="controls" style={{ position: 'fixed', top: 110, left: '50%', 
                    transform: 'translateX(-50%)', display: 'flex', gap: '8px', padding: '8px 10px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, justifyContent: "center", 
                    backdropFilter: 'blur(8px)'}}>

                    < button onClick={() => setActiveModel('model1')}>Standard Cue</button>
                    < button onClick={() => setActiveModel('model2')}>Full Splice Cue</button>

                </div>
                <div className="controls" style={{ position:'fixed', bottom: 250, left: '50%', 
                    transform: 'translateX(-50%)', display: 'flex', gap: '8px', padding: '8px 10px', 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, backdropFilter: 'blur(8px)', 
                    justifyContent: "center" }}>

                    <button className="control-btn" onClick={zoomIn}>Zoom In (+)</button>
                    <button className="control-btn" onClick={zoomOut}>Zoom Out (-)</button>
                    <button className="control-btn" onClick={resetView}>Reset View</button>

                </div>
            </div>
        </div>
    );
}
