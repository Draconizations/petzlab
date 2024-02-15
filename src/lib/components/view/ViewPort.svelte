<script lang="ts">
	import { makeBallz } from "$lib/utils/renderUtils"
	import { onMount } from "svelte"
  import * as THREE from "three"
  import { OrbitControls } from "three/examples/jsm/Addons.js"

  export let fuzzAmount = 0;
  export let ballSize = 100;
  
  let viewParentElement: Node

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x888888)
  const camera = new THREE.PerspectiveCamera(30, 1 / 1, 0.1, 1000)


  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(600, 600)

  const controls = new OrbitControls(camera, renderer.domElement)
  camera.position.z = 32
  controls.update()

  onMount(() => {
    viewParentElement.appendChild(renderer.domElement)
  })

  const ballz = makeBallz(2, 1, fuzzAmount)
  ballz.addBallz(scene)

  $: ballz.updateSize(ballSize, scene)
  $: ballz.updateFuzz(fuzzAmount)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
</script>

<div bind:this={viewParentElement}>

</div>
