<script lang="ts">
	import ViewPort from "$lib/components/view/ViewPort.svelte"
	import { debounce } from "$lib/utils"
	import { makeBallz, type BallOptions  } from "$lib/utils/renderUtils"
	import * as THREE from "three"
	import { OrbitControls, TransformControls } from "three/examples/jsm/Addons.js"

	const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()

  const transform = new TransformControls(camera, renderer.domElement)
	const orbit = new OrbitControls(camera, renderer.domElement)

	transform.addEventListener("objectChange", () => orbit.enableRotate = false)
	renderer.domElement.addEventListener("mouseup", () => orbit.enableRotate = true)

	transform.addEventListener("objectChange", debounce(() => {
		if (editing === -1) return

		balls[editing].pos = transform.object?.position || new THREE.Vector3(0, 0, 0)
		updateBall(editing)
	}, 250))

	const balls: BallOptions[] = [
		{
			outline: -1,
			fuzz: 3,
			size: 100,
			pos: new THREE.Vector3(0, 0, 0)
		},
		{
			outline: -1,
			fuzz: 2,
			size: 200,
			pos: new THREE.Vector3(2, 0, 0)
		}
	]

	let editing: number

	let ballz = makeBallz(balls)
	ballz.addBallz(scene)

  function updateBall(i: number) {
    ballz.updateBall(ballz.balls[i], balls[i], scene, transform)
		ballz = ballz
  }

  function setTransformControls(i: number) {
    transform.detach()
    if (i !== -1) { 
      transform.attach(ballz.balls[i].mesh)
			editing = i
    } else {
			editing = -1
    }
  }
</script>

<div class="row">
	<ViewPort {scene} {orbit} {transform} {camera} {renderer} />
	<div class="col pad">
    <button on:click={() => setTransformControls(-1)}>Quit Edit</button>
		{#each ballz.balls as ball, index}
      <div>
        <b>Ball #{index}</b><br/>
        <span>Fuzziness</span>
        <input type="number" bind:value={balls[index].fuzz} on:input={() => updateBall(index)}><br/>
        <span>Size</span>
        <input type="number" bind:value={balls[index].size} on:input={() => updateBall(index)}><br/>
        <button on:click={() => setTransformControls(index)}>Edit</button>
				[{ballz.balls[index].mesh.position.x.toFixed(2)}, {ballz.balls[index].mesh.position.y.toFixed(2)}, {ballz.balls[index].mesh.position.z.toFixed(2)}]
      </div>
    {/each}
	</div>
	<div id="help"></div>
</div>

<style>
	.row,
	.col {
		display: flex;
		flex-direction: column;
  }

	.pad {
		padding: 1rem;
		min-width: 0;
		min-height: 0;
	}

	@media (min-width: 600px) {
		.row {
			flex-direction: row;
		}
	}
</style>
