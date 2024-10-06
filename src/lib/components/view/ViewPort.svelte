<script lang="ts">
	import { onMount } from "svelte"
	import * as THREE from "three"
	import { OrbitControls, TransformControls } from "three/examples/jsm/Addons.js"

	let viewParentElement: Node

	let {
		scene = new THREE.Scene(),
		camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000),
		renderer = new THREE.WebGLRenderer(),
		transform = new TransformControls(camera, renderer.domElement),
		orbit = new OrbitControls(camera, renderer.domElement)
	}: {
		scene: THREE.Scene
		camera: THREE.Camera
		renderer: THREE.WebGLRenderer
		transform: TransformControls
		orbit: OrbitControls
	} = $props()

	scene.add(transform)

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

<div bind:this={viewParentElement}></div>
