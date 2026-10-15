import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Bear3D from './Bear3D'

const WHITE = 0xf4f4f4
const MIST = 0xd6d6d6
const BLACK = 0x0b0b0b

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Sombreado "de dibujos animados": pocos escalones de luz en lugar de un degradado suave
function makeGradient() {
  const data = new Uint8Array([80, 140, 205, 255])
  const texture = new THREE.DataTexture(data, data.length, 1, THREE.RedFormat)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
}

// Contorno grueso: se dibuja la misma figura inflada y por dentro, para que solo se vea el borde
function makeOutlineMaterial(color, thickness) {
  return new THREE.ShaderMaterial({
    uniforms: {
      thickness: { value: thickness },
      tint: { value: new THREE.Color(color) },
    },
    vertexShader: `
      uniform float thickness;
      void main() {
        vec3 p = position + normalize(normal) * thickness;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 tint;
      void main() { gl_FragColor = vec4(tint, 1.0); }
    `,
    side: THREE.BackSide,
  })
}

function ellipsoid(rx, ry, rz) {
  const geometry = new THREE.SphereGeometry(1, 48, 36)
  geometry.scale(rx, ry, rz)
  return geometry
}

function limb(radius, length) {
  // Cápsula colgando hacia abajo desde su extremo superior
  const geometry = new THREE.CapsuleGeometry(radius, length, 12, 28)
  geometry.translate(0, -(length / 2 + radius * 0.4), 0)
  return geometry
}

// Placa de esquinas redondeadas con un poco de grosor (para el letrero)
function roundedPlate(w, h, r, depth) {
  const x = -w / 2
  const y = -h / 2
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 10,
  })
  geometry.translate(0, 0, -depth / 2)
  return geometry
}

// Textura con el texto del letrero (se vuelve a dibujar cuando cargan las fuentes)
function makeSignTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 400
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '180px Anton, Impact, sans-serif'
    ctx.fillText('QUALITY SHOP', 512, 148)
    ctx.font = '500 50px "IBM Plex Mono", monospace'
    if ('letterSpacing' in ctx) ctx.letterSpacing = '14px'
    ctx.fillText('ROPA DE CALIDAD', 512, 316)
    texture.needsUpdate = true
  }

  draw()
  if (document.fonts) {
    Promise.all([document.fonts.load('180px Anton'), document.fonts.load('500 50px "IBM Plex Mono"')])
      .then(draw)
      .catch(() => {})
  }
  return texture
}

// Cuerda delgada entre dos puntos
function cord(a, b, makePart) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const length = dir.length()
  const piece = makePart(new THREE.CapsuleGeometry(0.022, length, 4, 8))
  piece.position.copy(a).add(b).multiplyScalar(0.5)
  piece.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  return piece
}

export default function BearScene() {
  const mountRef = useRef(null)
  const actionRef = useRef(() => {})
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute('role', 'img')
    renderer.domElement.setAttribute('aria-label', 'Oso de Quality Shop')
    mount.appendChild(renderer.domElement)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
    camera.position.set(0, 0.6, 7.6)
    camera.lookAt(0, 0.12, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.48))
    const key = new THREE.DirectionalLight(0xffffff, 1.75)
    key.position.set(-3.5, 4.5, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffffff, 0.55)
    rim.position.set(4, 2.5, -4)
    scene.add(rim)

    const gradient = makeGradient()
    const toon = (color) => new THREE.MeshToonMaterial({ color, gradientMap: gradient })
    const owned = [gradient]

    // Crea una pieza con su contorno. outline = null deja la pieza sin borde.
    function part(geometry, color, { outline = BLACK, thickness = 0.045 } = {}) {
      const group = new THREE.Group()
      const material = toon(color)
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)
      owned.push(geometry, material)
      if (outline !== null) {
        const edgeMaterial = makeOutlineMaterial(outline, thickness)
        group.add(new THREE.Mesh(geometry, edgeMaterial))
        owned.push(edgeMaterial)
      }
      return group
    }

    const root = new THREE.Group()
    scene.add(root)

    // ---- Cuerpo ----
    const body = part(ellipsoid(0.84, 0.96, 0.74), WHITE)
    root.add(body)

    const belly = part(ellipsoid(0.5, 0.6, 0.16), MIST, { outline: null })
    belly.position.set(0, -0.08, 0.62)
    body.add(belly)

    // Chorros de pintura, como en el logo
    const drips = [
      [0.12, 0.62, 0.7, 0.34],
      [-0.1, 0.66, 0.7, 0.2],
    ]
    drips.forEach(([x, y, z, length]) => {
      const drip = part(new THREE.CapsuleGeometry(0.035, length, 6, 14), BLACK, { outline: null })
      drip.position.set(x, y - length / 2, z)
      body.add(drip)
    })

    // ---- Piernas (sentado) ----
    ;[-1, 1].forEach((side) => {
      const leg = part(ellipsoid(0.42, 0.38, 0.58), WHITE)
      leg.position.set(side * 0.52, -0.8, 0.5)
      leg.rotation.y = side * -0.25
      root.add(leg)

      const pad = part(ellipsoid(0.27, 0.27, 0.06), MIST, { outline: null })
      pad.position.set(0, -0.02, 0.55)
      leg.add(pad)
    })

    // ---- Brazos ----
    const arms = [-1, 1].map((side) => {
      const pivot = new THREE.Group()
      pivot.position.set(side * 0.86, 0.45, 0.12)
      pivot.rotation.z = side * 0.28
      const arm = part(limb(0.21, 0.5), WHITE)
      pivot.add(arm)
      const paw = part(ellipsoid(0.25, 0.25, 0.23), WHITE)
      paw.position.set(0, -0.78, 0)
      pivot.add(paw)
      root.add(pivot)
      return pivot
    })
    const armWave = arms[1] // el brazo de la derecha de la pantalla

    // ---- Letrero colgado del cuello ----
    const sign = new THREE.Group()
    sign.position.set(0, 0.02, 0.92)
    sign.rotation.x = -0.08
    root.add(sign)

    const signBorder = part(roundedPlate(1.68, 0.8, 0.17, 0.05), WHITE, { outline: null })
    sign.add(signBorder)
    const board = part(roundedPlate(1.52, 0.64, 0.14, 0.07), BLACK, { outline: null })
    board.position.z = 0.035
    sign.add(board)

    const signTexture = makeSignTexture()
    const signText = new THREE.Mesh(
      new THREE.PlaneGeometry(1.42, 0.55),
      new THREE.MeshBasicMaterial({ map: signTexture, transparent: true, toneMapped: false }),
    )
    signText.position.z = 0.1
    sign.add(signText)
    owned.push(signTexture, signText.geometry, signText.material)

    ;[-1, 1].forEach((side) => {
      const makeCord = (geometry) => part(geometry, BLACK, { outline: null })
      root.add(
        cord(new THREE.Vector3(side * 0.62, 0.42, 0.93), new THREE.Vector3(side * 0.36, 0.82, 0.42), makeCord),
      )
    })

    // ---- Cabeza ----
    const head = new THREE.Group()
    head.position.set(0, 1.0, 0.08)
    root.add(head)

    const skull = part(ellipsoid(0.88, 0.78, 0.82), WHITE)
    skull.position.y = 0.5
    head.add(skull)

    // Orejas negras con borde blanco: resaltan sobre el fondo oscuro
    const ears = [-1, 1].map((side) => {
      const ear = part(ellipsoid(0.31, 0.31, 0.17), BLACK, { outline: WHITE, thickness: 0.05 })
      ear.position.set(side * 0.64, 1.12, -0.04)
      const inner = part(ellipsoid(0.15, 0.15, 0.05), MIST, { outline: null })
      inner.position.set(0, 0, 0.13)
      ear.add(inner)
      head.add(ear)
      return ear
    })

    const muzzle = part(ellipsoid(0.38, 0.28, 0.27), MIST)
    muzzle.position.set(0, 0.3, 0.74)
    head.add(muzzle)

    const nose = part(ellipsoid(0.12, 0.08, 0.07), BLACK, { outline: null })
    nose.position.set(0, 0.4, 1.0)
    head.add(nose)

    // Ojos en forma de X
    ;[-1, 1].forEach((side) => {
      const eye = new THREE.Group()
      ;[Math.PI / 4, -Math.PI / 4].forEach((angle) => {
        const stroke = part(new THREE.CapsuleGeometry(0.04, 0.26, 6, 14), BLACK, { outline: null })
        stroke.rotation.z = angle
        eye.add(stroke)
      })
      eye.position.set(side * 0.35, 0.6, 0.745)
      eye.lookAt(eye.position.x * 2.2, eye.position.y + 0.15, 4)
      head.add(eye)
    })

    const BASE_Y = -0.45
    root.position.y = BASE_Y

    // ---- Estado de la animación ----
    const pointer = { x: 0, y: 0, last: -1e9 }
    const pose = { yaw: 0, pitch: 0, bodyYaw: 0, earLag: 0 }
    const hop = { y: 0, v: 0 }
    const wave = { start: -10, duration: 1.9 }
    let time = 0
    let lastWave = 0
    let prev = 0
    let raf = 0
    let visible = true

    const startWave = () => {
      if (time - wave.start < wave.duration) return
      wave.start = time
      lastWave = time
    }

    // Un clic o toque hace que salude y salte
    actionRef.current = () => {
      startWave()
      hop.v = 3.4
    }

    function resize() {
      const { width, height } = mount.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    function frame(now) {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - prev) / 1000, 0.1)
      prev = now
      if (!visible || document.hidden) return
      time += dt

      // Mira al cursor; si no hay movimiento reciente, mira alrededor
      const idle = now - pointer.last > 3000
      const tx = idle ? Math.sin(time * 0.7) * 0.6 : pointer.x
      const ty = idle ? Math.sin(time * 0.5 + 1) * 0.25 : pointer.y
      const follow = 1 - Math.exp(-dt * 7)
      pose.yaw += (tx * 0.9 - pose.yaw) * follow
      pose.pitch += (ty * 0.5 - pose.pitch) * follow
      pose.bodyYaw += (tx * 0.28 - pose.bodyYaw) * (1 - Math.exp(-dt * 4))
      pose.earLag += (pose.yaw - pose.earLag) * (1 - Math.exp(-dt * 3.2))

      // Saluda sola de vez en cuando
      if (time - lastWave > 12) startWave()

      // Saludo
      const wt = time - wave.start
      const a = wt < wave.duration ? clamp(Math.min(wt / 0.35, (wave.duration - wt) / 0.35), 0, 1) : 0
      armWave.rotation.z = 0.28 + a * 2.25 + a * Math.sin(wt * 13) * 0.2
      head.rotation.z = a * Math.sin(wt * 6.5) * 0.07

      // Salto
      hop.v -= 15 * dt
      hop.y += hop.v * dt
      if (hop.y < 0) {
        hop.y = 0
        hop.v = 0
      }

      // El letrero se balancea un poco con el oso
      sign.rotation.z = Math.sin(time * 1.6) * 0.025 - pose.bodyYaw * 0.15
      sign.rotation.x = -0.08 - hop.v * 0.012

      // Respira y flota
      const breath = Math.sin(time * 2.1)
      root.position.y = BASE_Y + Math.sin(time * 1.2) * 0.05 + hop.y
      root.rotation.y = pose.bodyYaw
      body.scale.set(1 + breath * 0.008, 1 + breath * 0.016, 1 + breath * 0.008)
      head.position.y = 1.0 + breath * 0.012

      // La cabeza sigue al cursor
      head.rotation.y = pose.yaw - pose.bodyYaw * 0.6
      head.rotation.x = pose.pitch

      // Las orejas se mueven con un poco de retraso
      const flop = (pose.yaw - pose.earLag) * 0.9
      ears[0].rotation.z = 0.16 + flop + Math.sin(time * 2.7) * 0.025
      ears[1].rotation.z = -0.16 + flop - Math.sin(time * 2.7 + 1) * 0.025

      renderer.render(scene, camera)
    }

    function onMove(event) {
      const r = mount.getBoundingClientRect()
      pointer.x = clamp((event.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1)
      pointer.y = clamp((event.clientY - (r.top + r.height * 0.3)) / (window.innerHeight / 2), -1, 1)
      pointer.last = performance.now()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    visibilityObserver.observe(mount)

    resize()
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true })
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      owned.forEach((item) => item.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  if (failed) return <Bear3D />

  return <div className="bear-scene" ref={mountRef} onPointerDown={() => actionRef.current()} />
}
