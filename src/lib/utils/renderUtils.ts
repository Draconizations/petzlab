import * as THREE from "three"
import ballVertexShader from "$lib/shaders/ball.vert?raw"
import ballFragmentShader from "$lib/shaders/ball.frag?raw"

interface BallMesh extends BallOptions { 
  mesh: THREE.Mesh, 
}

export interface BallOptions {
  outline: number,
  fuzz: number,
  size: number,
  pos?: THREE.Vector3
}

export function makeBallz(options: BallOptions[]) {
  const ballz: BallMesh[] = []

  for (let i = 0; i < options.length; i++) {
    const mesh = createBallMesh(options[i])
    
    if (!options[i].pos) {
      options[i].pos = new THREE.Vector3(i * 2, 0, 0)
    } 
    
    mesh.position.set(options[i].pos?.x || 0, options[i].pos?.y || 0, options[i].pos?.z || 0)

    ballz.push({...options[i], ...{ 
      mesh, 
      pos: mesh.position, 
    }})
  }
  
  return {
    addBallz: (scene: THREE.Scene) => {
      ballz.forEach(b => scene.add(b.mesh))
    },
    removeBallz: (scene: THREE.Scene) => {
      ballz.forEach(b => scene.remove(b.mesh))
    },
    updateFuzzAll: (fuzzAmount: number) => {
      ballz.forEach((b, i) => {
        const material = b.mesh.material as THREE.ShaderMaterial
        material.uniforms.fuzzAmount = { value: fuzzAmount / 50 }
        ballz[i].mesh = b.mesh
      })
    },
    updateSizeAll: (ballSize: number, scene: THREE.Scene) => {
      ballz.forEach((b, i) => {
        scene.remove(b.mesh)
        const mesh = createBallMesh({...b, ...{size: ballSize}})
        scene.add(mesh)
        ballz[i].mesh = mesh
      })
    },
    updateBall: (ball: BallMesh, options: BallOptions, scene: THREE.Scene) => {
      scene.remove(ball.mesh)
      const mesh = createBallMesh(options)
      scene.add(mesh)
      ball.mesh = mesh
    },
    balls: ballz
  }
}

function createMaterial(options: BallOptions) {
  return new THREE.ShaderMaterial({
    uniforms: {
      fuzzAmount: { value: options.fuzz / 50 },
      ballSize: { value: options.size / 100 },
      viewportSize: { value: new THREE.Vector2(600, 600)},
      outlines: { value: options.outline }
    },
    vertexShader: ballVertexShader,
    fragmentShader: ballFragmentShader,
    alphaTest: 1,
    transparent: true
  })
}

function createGeometry(options: BallOptions) {
  const size = options.size / 100;
  return new THREE.PlaneGeometry(size, size)
}

function createMesh(geometry: THREE.PlaneGeometry, material: THREE.ShaderMaterial) {
  return new THREE.Mesh(geometry, material)
}

function createBallMesh(options: BallOptions) {
  const material = createMaterial(options)
  const geometry = createGeometry(options)

  const mesh = createMesh(geometry, material)
  mesh.position.set(options.pos?.x || 0, options.pos?.y || 0, options.pos?.z || 0)
  return mesh
}