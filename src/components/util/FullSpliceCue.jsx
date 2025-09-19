// Full Splice Cue model as a reusable react component
import React from 'react'
import { useGLTF } from '@react-three/drei'

export function FullSpliceCue(props) {
  const { nodes, materials } = useGLTF('/FullSpliceCue.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Ferrule.geometry} material={materials.Material} position={[0.068, 97.727, -759.004]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 806.706, 15]} />
      <mesh geometry={nodes.Shaft_Collar_Ring.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 736.5, 15]} />
      <mesh geometry={nodes.Shaft_Collar.geometry} material={materials['BioMed Clear Material 2']} position={[0, 97.833, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 736.5, 15]} />
      <mesh geometry={nodes.Shaft.geometry} material={materials['Maple-Birdseye']} position={[0, 97.833, 0.61]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 769.062, 15]} />
      <mesh geometry={nodes.Tip.geometry} material={materials['Composite Rubber']} position={[0, 97.833, 58.233]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 827.78, 15]} />
      <mesh geometry={nodes.Bumper.geometry} material={materials['Composite Rubber']} position={[0, 97.833, 707.089]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 1.768, 10]} />
      <mesh geometry={nodes.Butt_Cap.geometry} material={materials['Composite Rubber']} position={[0, 97.833, -36.13]} rotation={[Math.PI / 2, 0, 0]} scale={[15.78, 736.5, 15.78]} />
      <mesh geometry={nodes.Joint_Collar.geometry} material={materials.Wenge} position={[0, 97.833, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 736.5, 15]} />
      <mesh geometry={nodes.Joint_Collar_Ring.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, 0.497]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 720.002, 15]} />
      <mesh geometry={nodes.Butt_Cap_Ring.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, 650.912]} rotation={[Math.PI / 2, 0, 0]} scale={[22.84, 720.002, 22.84]} />
      <mesh geometry={nodes.JMCC_Logo.geometry} material={materials['JMCC White Logo']} position={[0.182, 111.457, 686.798]} scale={[12.5, 1, 12.5]} />
      <mesh geometry={nodes.Handle.geometry} material={materials['Walnut-Black']} position={[0, 97.833, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[16, 736.5, 16]} />
      <mesh geometry={nodes.Forearm.geometry} material={materials['Maple-Birdseye']} position={[0, 97.833, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 736.5, 15]} />
    </group>
  )
}

useGLTF.preload('/FullSpliceCue.glb')
