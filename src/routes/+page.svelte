<script lang="ts">
	import ViewPort from "$components/view/ViewPort.svelte"
	import { makeScene, type Ball, type BallMesh } from "$lib/utils/renderUtils.svelte"
	import * as THREE from "three"
	import { OrbitControls, TransformControls } from "three/examples/jsm/Addons.js"
	import { history } from "$lib/history.svelte"
	import { onMount } from "svelte"

	onMount(() => {
		// so we don't attach the event listener multiple times in dev
		if (!history.listening) {
			history.listening = true
			document.addEventListener("keydown", (e) => {
				if (e.ctrlKey && e.key === "z") {
					history.undo()
				} else if (e.ctrlKey && e.key === "y") {
					history.redo()
				}
			})
		}
	})

	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000)
	const renderer = new THREE.WebGLRenderer()

	const transform = new TransformControls(camera, renderer.domElement)
	const orbit = new OrbitControls(camera, renderer.domElement)

	transform.addEventListener("objectChange", () => (orbit.enableRotate = false))
	renderer.domElement.addEventListener("mouseup", () => (orbit.enableRotate = true))

	transform.addEventListener("objectChange", () => {
		if (workspace.active) {
			const callback = () => {
				if (workspace.active) {
					if (workspace.active.x !== transform.object?.position.x || 0)
						workspace.active.x = transform.object?.position.x || 0

					if (workspace.active.y !== transform.object?.position.y || 0) 
						workspace.active.y = transform.object?.position.y || 0
					
					if (workspace.active.z !== transform.object?.position.z || 0) 
						workspace.active.z = transform.object?.position.z || 0
				}

				transform.removeEventListener("mouseUp", callback)
			}

			transform.addEventListener("mouseUp", callback)
		}
	})

	const balls: Ball[] = [
		{
			outline: -1,
			fuzz: 3,
			size: 100,
			x: 0,
			y: 0,
			z: 0
		},
		{
			outline: -1,
			fuzz: 2,
			size: 200,
			x: 2,
			y: 0,
			z: 0
		}
	]

	let workspace = makeScene(scene, balls, { transform })
</script>

<div style="display: flex; flex-gap: 0.5rem;">
	<ViewPort {scene} {orbit} {transform} {camera} {renderer} />

	<div>
		{#each workspace.list as ball, i}
			<div style="margin: 0.5rem; margin-bottom: 1rem;">
				<b>Ball #{i}</b>
				{#if workspace.active === ball}
					<button onclick={() => (workspace.active = undefined)}>deselect</button>
				{:else}
					<button onclick={() => (workspace.active = ball)}>select</button>
				{/if}
				<br />
				size: <input bind:value={ball.size} type="number" min={1} max={1000} /><br />
				fuzz: <input bind:value={ball.fuzz} type="number" min={0} max={100} /><br />
				<b>position:</b>
				x <input bind:value={ball.x} type="number" style="width: 3rem;" />
				y <input bind:value={ball.y} type="number" style="width: 3rem;" />
				z <input bind:value={ball.z} type="number" style="width: 3rem;" />
			</div>
		{/each}
	</div>
</div>
