import * as THREE from "three"
import ballVertexShader from "$lib/shaders/ball.vert?raw"
import ballFragmentShader from "$lib/shaders/ball.frag?raw"

interface BallMesh { 
  mesh: THREE.Mesh, 
  pos: THREE.Vector3, 
  index: number,
  size: number
}

export function makeBallz(amount: number, ballSize: number, fuzzAmount: number) {
  const ballz: BallMesh[] = []

  for (let i = 0; i < amount; i++) {
    const mesh = createBallMesh(i, ballSize, fuzzAmount)
    mesh.position.set(i * 2, 0, 0)

    ballz.push({ mesh, pos: new THREE.Vector3(i * 2, 0, 0), index: i, size: ballSize})
  }
  
  return {
    addBallz: (scene: THREE.Scene) => {
      ballz.forEach(b => scene.add(b.mesh))
    },
    removeBallz: (scene: THREE.Scene) => {
      ballz.forEach(b => scene.remove(b.mesh))
    },
    updateFuzz: (fuzzAmount: number) => {
      ballz.forEach((b, i) => {
        const material = b.mesh.material as THREE.ShaderMaterial
        material.uniforms.fuzzAmount = { value: fuzzAmount / 50 }
        ballz[i].mesh = b.mesh
      })
    },
    updateSize: (ballSize: number, scene: THREE.Scene) => {
      ballz.forEach((b, i) => {
        scene.remove(b.mesh)
        const material = b.mesh.material as THREE.ShaderMaterial
        const mesh = createBallMesh(i, ballSize, material.uniforms.fuzzAmount.value)
        mesh.position.set(b.pos.x, b.pos.y, b.pos.z)
        scene.add(mesh)
        ballz[i].mesh = mesh
      })

    },
  }
}

function createMaterial(i: number, ballSize: number, fuzzAmount: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      fuzzAmount: { value: fuzzAmount / 50 },
      ballSize: { value: ballSize / 100 },
      viewportSize: { value: new THREE.Vector2(600, 600)},
      zAdd: { value: i },
    },
    vertexShader: ballVertexShader,
    fragmentShader: ballFragmentShader,
    alphaTest: 1,
    transparent: true
  })
}

function createGeometry(ballSize: number) {
  const size = ballSize / 100;
  return new THREE.PlaneGeometry(size, size)
}

function createMesh(geometry: THREE.PlaneGeometry, material: THREE.ShaderMaterial) {
  return new THREE.Mesh(geometry, material)
}

function createBallMesh(i: number, ballSize: number, fuzzAmount: number) {
  const material = createMaterial(i, ballSize, fuzzAmount)
  const geometry = createGeometry(ballSize)
  
  return createMesh(geometry, material)
}