<script lang="ts">
	import ViewPort from "$lib/components/view/ViewPort.svelte"
	import * as THREE from "three"
	import { makeBallz  } from "$lib/utils/renderUtils"
  import { OrbitControls, TransformControls } from "three/examples/jsm/Addons.js";

	const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()

  const transform = new TransformControls(camera, renderer.domElement)
  scene.add(transform)

  const controls = new OrbitControls(camera, renderer.domElement)
  camera.position.z = 32
  controls.update()

	const balls = [
		{
			outline: -1,
			fuzz: 3,
			size: 100
		},
		{
			outline: -1,
			fuzz: 2,
			size: 200
		}
	]

	const ballz = makeBallz(balls)
	ballz.addBallz(scene)

  function updateBall(i: number) {
    ballz.updateBall(ballz.balls[i], balls[i], scene)
  }

  function setTransformControls(i: number) {
    transform.detach()
    if (i !== -1) { 
      transform.attach(ballz.balls[i].mesh)
      controls.enableRotate = false
    } else {
      controls.enableRotate = true
    }
  }
</script>

<div class="row">
	<ViewPort scene={scene} camera={camera} {renderer} />
	<div class="col">
    <button on:click={() => setTransformControls(-1)}>Quit Edit</button>
		{#each ballz.balls as ball, index}
      <div>
        <b>Ball #{index}</b><br/>
        <span>Fuzziness</span>
        <input type="number" bind:value={balls[index].fuzz} on:input={() => updateBall(index)}><br/>
        <span>Size</span>
        <input type="number" bind:value={balls[index].size} on:input={() => updateBall(index)}><br/>
        <button on:click={() => setTransformControls(index)}>Edit</button>
      </div>
    {/each}
	</div>
</div>

<style>
	.row,
	.col {
		display: flex;
		flex-direction: column;
    gap: 0.5rem;
  }

	.col {
		padding: 0.5rem;
	}

	@media (min-width: 600px) {
		.row {
			flex-direction: row;
		}
	}
</style>
