import { useEffect, useRef } from 'react'
import { getLogoCutout } from '../cutout'

const PAD = 44 // margen alrededor del oso para el movimiento y el grosor
const STRIPS = 40 // franjas horizontales con las que se dobla la cabeza
const DEPTH = 9 // capas que forman el grosor de la pegatina
const NECK = 0.5 // altura (0 a 1) donde termina la cabeza y empieza el cuerpo
const HEAD_X = 44 // cuánto se desplaza la cabeza de lado
const HEAD_Y = 20 // cuánto se desplaza la cabeza arriba y abajo

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Oso con efecto 3D: grosor tipo pegatina, inclinación según el cursor y la cabeza que lo sigue
export default function Bear3D() {
  const tiltRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const tilt = tiltRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const pointer = { x: 0, y: 0, last: -1e9 }
    const cur = { x: 0, y: 0 }
    let cut = null
    let shade = null
    let iw = 0
    let ih = 0
    let LW = 0
    let LH = 0
    let raf = 0
    let visible = true
    let alive = true

    // Dibuja el oso partido en franjas; las de arriba (la cabeza) se mueven más que las del cuello
    function drawWarped(src, ox, oy, alpha) {
      ctx.globalAlpha = alpha
      const sh = ih / STRIPS
      const cx = iw / 2
      for (let k = 0; k < STRIPS; k++) {
        const sy = k * sh
        const mid = (sy + sh / 2) / ih
        const w = mid < NECK ? Math.pow(1 - mid / NECK, 1.4) : 0
        const dx = cur.x * HEAD_X * w
        const dy = cur.y * HEAD_Y * w
        const scaleX = 1 - Math.abs(cur.x) * 0.05 * w
        const srcH = Math.min(sh + 1, ih - sy)
        ctx.drawImage(
          src,
          0, sy, iw, srcH,
          PAD + ox + cx + (0 - cx) * scaleX + dx, PAD + oy + sy + dy, iw * scaleX, srcH,
        )
      }
    }

    function render() {
      const s = canvas.width / LW
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(s, 0, 0, s, 0, 0)
      ctx.imageSmoothingQuality = 'high'

      // Grosor: capas grises hacia el fondo, más oscuras mientras más lejos
      const ex = 7 - cur.x * 9
      const ey = 9 - cur.y * 7
      for (let i = DEPTH; i >= 1; i--) {
        const f = i / DEPTH
        drawWarped(shade, ex * f, ey * f, 0.9 - 0.55 * f)
      }
      drawWarped(cut, 0, 0, 1)
      ctx.globalAlpha = 1

      tilt.style.transform = `perspective(1100px) rotateY(${(cur.x * 9).toFixed(2)}deg) rotateX(${(-cur.y * 7).toFixed(2)}deg)`
    }

    function resize() {
      if (!cut) return
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      render()
    }

    let prev = 0

    function frame(t) {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(t - prev, 250)
      prev = t
      if (!visible || document.hidden) return

      // Sigue al cursor; si no hay movimiento (o es un celular), se mece sola
      let tx
      let ty
      if (t - pointer.last < 3000) {
        tx = pointer.x
        ty = pointer.y
      } else {
        tx = Math.sin(t / 1700) * 0.55
        ty = Math.sin(t / 2300) * 0.28
      }
      // Suavizado según el tiempo real, para que se vea igual a cualquier velocidad de cuadros
      const k = 1 - Math.exp(-dt / 140)
      cur.x += (tx - cur.x) * k
      cur.y += (ty - cur.y) * k
      render()
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect()
      pointer.x = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1)
      pointer.y = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1)
      pointer.last = performance.now()
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })

    getLogoCutout()
      .then((source) => {
        if (!alive) return
        cut = source
        iw = source.width
        ih = source.height
        LW = iw + PAD * 2
        LH = ih + PAD * 2

        // Copia en gris para el grosor: se oscurece el blanco y se conserva la silueta
        shade = document.createElement('canvas')
        shade.width = iw
        shade.height = ih
        const sctx = shade.getContext('2d')
        sctx.drawImage(source, 0, 0)
        sctx.globalCompositeOperation = 'multiply'
        sctx.fillStyle = '#9a9a9a'
        sctx.fillRect(0, 0, iw, ih)
        sctx.globalCompositeOperation = 'destination-in'
        sctx.drawImage(source, 0, 0)

        canvas.style.aspectRatio = `${LW} / ${LH}`
        resize()
        resizeObserver.observe(canvas)
        visibilityObserver.observe(canvas)

        if (!reduce) {
          window.addEventListener('pointermove', onMove, { passive: true })
          raf = requestAnimationFrame(frame)
        }
      })
      .catch(() => {})

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [])

  return (
    <div className="bear3d">
      <div className="bear3d__tilt" ref={tiltRef}>
        <canvas ref={canvasRef} role="img" aria-label="Quality Shop" />
      </div>
    </div>
  )
}
