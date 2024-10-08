import * as THREE from "three"
import ballVertexShader from "$lib/shaders/ball.vert?raw"
import ballFragmentShader from "$lib/shaders/ball.frag?raw"
import type { TransformControls } from "three/examples/jsm/Addons.js"
import { history } from "$lib/history.svelte"

export interface BallMesh extends Ball { 
  mesh: THREE.Mesh
  readonly scene: THREE.Scene
  transform?: TransformControls
}

export interface Ball {
  outline: number,
  fuzz: number,
  size: number,
  pos: Position
}

export type Position = {
  x: number,
  y: number,
  z: number
}

export function makeScene(scene: THREE.Scene, ballz: Ball[], extra?: { transform?: TransformControls}) {
  let _list: BallMesh[] = $state([])
  const _scene = scene

  const _transform: TransformControls|undefined = extra?.transform || undefined
  let _active: BallMesh|undefined = $state(undefined)
  

  ballz.forEach(b => {
    const ball = createBall(b, _scene)
    _list.push(ball)
    _scene.add(ball.mesh)
  })
  
  return {
    get list() {
      return _list
    },
    set list(list: BallMesh[]) {
      _list = list
    },
    get scene() {
      return _scene
    },
    get transform() {
      return _transform
    },
    get active() {
      return _active
    },
    set active(active: BallMesh|undefined) {
      if (_active) {
        _active.transform = undefined
      }

      _transform?.detach()
      _active = active

      if (_active) {
        _active.transform = _transform
        _transform?.attach(_active.mesh)
      }
    }
  }
}

export function createBall(ball: Ball, scene: THREE.Scene): BallMesh {
  function updateSize() {
    if (_transform) _transform.detach()
      
      _scene.remove(_mesh)
      _mesh = createBallMesh(_ball)
      _scene.add(_mesh)

    if (_transform) _transform.attach(_mesh)
  }

  function updatePosition(pos: Position) {
    _mesh.position.set(pos.x, pos.y, pos.z)
  }

  const _ball = $state(createSingularBall(ball))
  let _mesh = $state(createBallMesh(ball))

  const _scene = scene
  let _transform: TransformControls|undefined = $state(undefined)

  updatePosition(_ball.pos)

  return {
    get outline() {
      return _ball.outline
    },
    set outline(outline: number) {
      _ball.outline = outline
    },
    get fuzz() {
      return _ball.fuzz
    },
    set fuzz(fuzz: number) {
      const curr = fuzz > 10 ? 10 : fuzz < 0 ? 0 : fuzz
      const prev = _ball.fuzz
      
      history.push(() => {
        _ball.fuzz = prev
        ;(_mesh.material as THREE.ShaderMaterial).uniforms.fuzzAmount = { value: prev / 50}
      },() => {
        _ball.fuzz = curr
        ;(_mesh.material as THREE.ShaderMaterial).uniforms.fuzzAmount = { value: curr / 50}
      })
      
      _ball.fuzz = curr
      ;(_mesh.material as THREE.ShaderMaterial).uniforms.fuzzAmount = { value: curr / 50}
    },
    get size() {
      return _ball.size
    },
    set size(size: number) {
      const prev = _ball.size

      history.push(() => {
        _ball.size = prev
        updateSize()
      }, () => {
        _ball.size = size
        updateSize()
      })

      _ball.size = size
      updateSize()
    },
    get pos() {
      return _ball.pos
    },
    set pos(pos: Position) {
      const curr = {...pos}
      const prev = {..._ball.pos}

      history.push(() => {
        _ball.pos = prev
        updatePosition(prev)
      }, () => {
        _ball.pos = curr
        updatePosition(curr)
      })

      _ball.pos = curr
      updatePosition(curr)
    },
    get mesh() {
      return _mesh
    },
    set mesh(mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial, THREE.Object3DEventMap>) {
      _mesh = mesh
    },
    get scene() {
      return _scene
    },
    get transform() {
      return _transform
    },
    set transform(transform: TransformControls|undefined) {
      _transform = transform
    }
  }
}

function createSingularBall(ball: Ball): Ball { 
  let _outline = $state(ball.outline)
  let _fuzz = $state(ball.fuzz)
  let _size = $state(ball.size)
  let _pos = $state(createPos(ball.pos))

  return {
    get outline() {
      return _outline
    },
    set outline(outline: number) {
      _outline = outline
    },
    get fuzz() {
      return _fuzz
    },
    set fuzz(fuzz: number) {
      _fuzz = fuzz
    },
    get size() {
      return _size
    },
    set size(size: number) {
      _size = size
    },
    get pos() {
      return _pos
    },
    set pos(pos: Position) {
      _pos = pos
    }
  }
}

export function createPos(pos: Position): Position {
  let _x = $state(pos.x)
  let _y = $state(pos.y)
  let _z = $state(pos.z)

  return {
    get x() {
      return _x
    },
    set x(x: number) {
      _x = x
    },
    get y() {
      return _y
    },
    set y(y: number) {
      _y = y
    },
    get z() {
      return _z
    },
    set z(z: number) {
      _z = z
    }
  }
}

function createMaterial(options: Ball) {
  return new THREE.ShaderMaterial({
    uniforms: {
      fuzzAmount: { value: options.fuzz / 50 },
      ballSize: { value: options.size / 100 },
      viewportSize: { value: new THREE.Vector2(500, 500)},
      outlines: { value: options.outline }
    },
    vertexShader: ballVertexShader,
    fragmentShader: ballFragmentShader,
    alphaTest: 1,
    transparent: true
  })
}

function createGeometry(options: Ball) {
  const size = options.size / 100;
  return new THREE.PlaneGeometry(size, size)
}

function createMesh(geometry: THREE.PlaneGeometry, material: THREE.ShaderMaterial) {
  return new THREE.Mesh(geometry, material)
}

function createBallMesh(options: Ball) {
  const material = createMaterial(options)
  const geometry = createGeometry(options)

  const mesh = createMesh(geometry, material)
  mesh.position.set(options.pos.x, options.pos.y, options.pos.z)
  return mesh
}