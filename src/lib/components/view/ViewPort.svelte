<script lang="ts">
	import { onMount } from "svelte"
  import * as THREE from "three"
  
  let viewParentElement: Node

  export let scene: THREE.Scene
  scene.background = new THREE.Color(0x888888)
  export let camera: THREE.Camera
  export let renderer: THREE.WebGLRenderer

  renderer.setSize(600, 600)

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
