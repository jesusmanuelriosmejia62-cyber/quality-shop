import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si faltan las claves en el archivo .env, la página usa los datos de ejemplo de src/data.js
export const supabase = url && key ? createClient(url, key) : null

// Reduce la foto antes de subirla (máximo 1600 px) para que la página cargue rápido
export async function shrinkImage(file, max = 1600) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86))
  return blob ?? file
}

// Sube una foto a la carpeta pública "productos" y devuelve su dirección
export async function uploadImage(file) {
  const blob = await shrinkImage(file)
  const name = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 40) || 'foto'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${name}.jpg`
  const { error } = await supabase.storage.from('productos').upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    cacheControl: '31536000',
  })
  if (error) throw error
  return supabase.storage.from('productos').getPublicUrl(path).data.publicUrl
}
