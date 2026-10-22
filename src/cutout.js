import { useEffect, useState } from 'react'
import { logo } from './data'

let cached = null

// Quita el fondo negro que rodea al logo (solo el que está conectado a los bordes),
// así el oso queda recortado y se puede poner sobre cualquier fondo.
export function getLogoCutout() {
  if (cached) return cached

  cached = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const w = img.naturalWidth
      const h = img.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0)

      const data = ctx.getImageData(0, 0, w, h)
      const px = data.data
      const seen = new Uint8Array(w * h)
      const stack = []

      const isDark = (i) => px[i * 4] + px[i * 4 + 1] + px[i * 4 + 2] < 60
      const push = (x, y) => {
        const i = y * w + x
        if (!seen[i] && isDark(i)) {
          seen[i] = 1
          stack.push(i)
        }
      }

      for (let x = 0; x < w; x++) {
        push(x, 0)
        push(x, h - 1)
      }
      for (let y = 0; y < h; y++) {
        push(0, y)
        push(w - 1, y)
      }

      while (stack.length) {
        const i = stack.pop()
        px[i * 4 + 3] = 0
        const x = i % w
        const y = (i / w) | 0
        if (x > 0) push(x - 1, y)
        if (x < w - 1) push(x + 1, y)
        if (y > 0) push(x, y - 1)
        if (y < h - 1) push(x, y + 1)
      }

      ctx.putImageData(data, 0, 0)
      resolve(canvas)
    }
    img.onerror = reject
    img.src = logo
  })

  return cached
}

// Versión en URL para usarla como imagen normal (por ejemplo, de fondo flotante)
export function useLogoCutoutUrl() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    let alive = true
    getLogoCutout()
      .then((canvas) => {
        if (alive) setUrl(canvas.toDataURL('image/png'))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return url
}

let cachedSticker = null

// Recorta la imagen del oso con su borde blanco de pegatina: se quita todo lo que se alcanza
// desde el borde de la foto sin cruzar el borde blanco, y se queda solo la pieza más grande.
export function getStickerCutout(src) {
  if (cachedSticker) return cachedSticker

  cachedSticker = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 900
      const scale = Math.min(1, MAX / img.naturalWidth)
      const w = Math.round(img.naturalWidth * scale)
      const h = Math.round(img.naturalHeight * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, w, h)

      const data = ctx.getImageData(0, 0, w, h)
      const px = data.data
      const n = w * h

      // Blanco: el borde de la pegatina
      const white = new Uint8Array(n)
      for (let i = 0; i < n; i++) {
        if (px[i * 4] >= 165 && px[i * 4 + 1] >= 165 && px[i * 4 + 2] >= 165) white[i] = 1
      }

      // Se engorda el borde blanco unos píxeles para cerrar grietas por donde el fondo podría colarse
      const wall = new Uint8Array(white)
      for (let pass = 0; pass < 5; pass++) {
        const grown = new Uint8Array(wall)
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const i = y * w + x
            if (wall[i - 1] || wall[i + 1] || wall[i - w] || wall[i + w]) grown[i] = 1
          }
        }
        wall.set(grown)
      }

      // Fondo: lo que se alcanza desde el borde de la imagen sin cruzar el borde
      const bg = new Uint8Array(n)
      const stack = []
      const push = (x, y) => {
        const i = y * w + x
        if (!bg[i] && !wall[i]) {
          bg[i] = 1
          stack.push(i)
        }
      }
      for (let x = 0; x < w; x++) {
        push(x, 0)
        push(x, h - 1)
      }
      for (let y = 0; y < h; y++) {
        push(0, y)
        push(w - 1, y)
      }
      while (stack.length) {
        const i = stack.pop()
        const x = i % w
        const y = (i / w) | 0
        if (x > 0) push(x - 1, y)
        if (x < w - 1) push(x + 1, y)
        if (y > 0) push(x, y - 1)
        if (y < h - 1) push(x, y + 1)
      }

      // De lo que no es fondo, se queda solo la pieza más grande (la pegatina)
      const label = new Int32Array(n)
      let best = 0
      let bestSize = 0
      let next = 0
      for (let s0 = 0; s0 < n; s0++) {
        if (bg[s0] || label[s0]) continue
        next++
        let size = 0
        label[s0] = next
        stack.push(s0)
        while (stack.length) {
          const i = stack.pop()
          size++
          const x = i % w
          const y = (i / w) | 0
          const visit = (j) => {
            if (!bg[j] && !label[j]) {
              label[j] = next
              stack.push(j)
            }
          }
          if (x > 0) visit(i - 1)
          if (x < w - 1) visit(i + 1)
          if (y > 0) visit(i - w)
          if (y < h - 1) visit(i + w)
        }
        if (size > bestSize) {
          bestSize = size
          best = next
        }
      }

      let minX = w
      let minY = h
      let maxX = 0
      let maxY = 0
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x
          if (label[i] !== best) {
            px[i * 4 + 3] = 0
            continue
          }
          const edge = x === 0 || y === 0 || x === w - 1 || y === h - 1 || label[i - 1] !== best || label[i + 1] !== best || label[i - w] !== best || label[i + w] !== best
          if (edge) px[i * 4 + 3] = 170
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
      ctx.putImageData(data, 0, 0)

      const cw = maxX - minX + 1
      const ch = maxY - minY + 1
      const out = document.createElement('canvas')
      out.width = cw
      out.height = ch
      out.getContext('2d').drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch)
      resolve(out)
    }
    img.onerror = reject
    img.src = src
  })

  return cachedSticker
}
