<script lang="ts">
	import { onMount } from "svelte"
  import * as THREE from "three"
  import { OrbitControls, TransformControls } from "three/examples/jsm/Addons.js";
  
  let viewParentElement: Node

  export let scene = new THREE.Scene()
  export let camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000)
  export let renderer = new THREE.WebGLRenderer()

  export let transform = new TransformControls(camera, renderer.domElement)
  scene.add(transform)

  export let orbit = new OrbitControls(camera, renderer.domElement)
  camera.position.z = 32
  orbit.update()

  scene.background = new THREE.Color(0x888888)

  renderer.setSize(500, 500)

  onMount(() => {
    viewParentElement.appendChild(renderer.domElement)
  })

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
</script>

<div bind:this={viewParentElement}>

</div>
