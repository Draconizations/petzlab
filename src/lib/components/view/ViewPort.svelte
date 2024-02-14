<script lang="ts">
	import { onMount } from "svelte"
  import * as THREE from "three"
  import { OrbitControls } from "three/examples/jsm/Addons.js"

  import ballVertexShader from "$lib/shaders/ball.vert?raw"
  import ballFragmentShader from "$lib/shaders/ball.frag?raw"

  export let fuzzAmount = 0;
  export let ballSize = 100;
  
  let viewParentElement: Node

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x888888)
  const camera = new THREE.PerspectiveCamera(30, 1 / 1, 0.1, 1000)


  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(600, 600)

  const geometry = new THREE.PlaneGeometry(1, 1)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      fuzzAmount: { value: 0.05 },
      ballSize: { value: 1 },
      viewportSize: { value: new THREE.Vector2(600, 600)},
      zAdd: { value: 0 },
      zCenterPetWorld: { value: new THREE.Vector3(0,0,0) }
    },
    vertexShader: ballVertexShader,
    fragmentShader: ballFragmentShader,
    alphaTest: 1,
    transparent: true
  })


  let circles: THREE.Mesh[] = []

  for (let i = 0; i < 2; i++) {
    let circle = new THREE.Mesh(geometry, material)
    circle.translateX(i * 2);
    circles.push(circle);
  }

  circles.forEach(c => scene.add(c))

  const controls = new OrbitControls(camera, renderer.domElement)
  camera.position.z = 32
  controls.update()

  onMount(() => {
    viewParentElement.appendChild(renderer.domElement)
  })

  $: material.uniforms.ballSize = { value: ballSize / 100 }
  $: circles = circles.map(c => {
    scene.remove(c)
    let pos = c.position
    c = new THREE.Mesh(new THREE.PlaneGeometry(ballSize / 100, ballSize / 100), material)
    c.translateX(pos.x)
    scene.add(c)
    return c
  })
  $: material.uniforms.fuzzAmount = { value: fuzzAmount / 50 }

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
</script>

<div bind:this={viewParentElement}>

</div>
