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
