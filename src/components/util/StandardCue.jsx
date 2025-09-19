// Standard Butt Cue as reusable react components
import React from 'react'
import { useGLTF } from '@react-three/drei'

export function StandardCue(props) {
  const { nodes, materials } = useGLTF('/StandardCue.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Ferrule.geometry} material={materials['Material.003']} position={[0.017, 97.833, -759.562]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 941.157, 15]} />
      <mesh geometry={nodes.Shaft_Collar_Ring.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, -10.981]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 777.387, 15]} />
      <mesh geometry={nodes.Shaft_Collar.geometry} material={materials.Olivewood} position={[0, 97.833, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 736.5, 15]} />
      <mesh geometry={nodes.Shaft.geometry} material={materials['Maple-Birdseye']} position={[0, 97.833, 0.403]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 769.062, 15]} />
      <mesh geometry={nodes.Tip.geometry} material={materials['Composite Rubber']} position={[0.017, 97.833, -770.425]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 827.78, 15]} />
      <mesh geometry={nodes.Bumper.geometry} material={materials['Composite Rubber']} position={[0, 97.833, 707.089]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 1.768, 10]} />
      <mesh geometry={nodes.Butt_Cap.geometry} material={materials['Composite Rubber']} position={[0, 97.833, -36.13]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 736.5, 15]} />
      <mesh geometry={nodes.Butt_Sleeve.geometry} material={materials.Purpleheart} position={[-1.316, 98.479, 634.465]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 901.505, 15]} />
      <mesh geometry={nodes.Forearm.geometry} material={materials['Bubinga-Figured']} position={[0, 97.833, -2.047]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 785.575, 15]} />
      <mesh geometry={nodes.Handle.geometry} material={materials['Pig Black']} position={[0, 97.833, 74.957]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 594.272, 15]} />
      <mesh geometry={nodes.Joint_Collar.geometry} material={materials['Bubinga-Figured']} position={[0, 97.833, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 736.5, 15]} />
      <mesh geometry={nodes.Joint_Collar_Ring.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, 0.497]} rotation={[Math.PI / 2, 0, 0]} scale={[15, 720.002, 15]} />
      <mesh geometry={nodes.Butt_Cap_Ring.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, 677.558]} rotation={[Math.PI / 2, 0, 0]} scale={[21.6, 762.002, 21.6]} />
      <mesh geometry={nodes.Handle_Ring_1.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, 571.685]} rotation={[Math.PI / 2, 0, 0]} scale={[21.009, 701.042, 21.009]} />
      <mesh geometry={nodes.Handle_Ring_2.geometry} material={materials['Mother of Pearl']} position={[0, 97.833, 285.954]} rotation={[Math.PI / 2, 0, 0]} scale={[17.648, 720.002, 17.648]} />
      <mesh geometry={nodes.JMCC_Logo.geometry} material={materials['JMCC White Logo']} position={[0.182, 110.766, 686.798]} scale={[12.5, 1, 12.5]} />
    </group>
  )
}

useGLTF.preload('/StandardCue.glb')
