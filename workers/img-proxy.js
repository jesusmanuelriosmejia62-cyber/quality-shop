// Proxy con caché de Cloudflare para las fotos de la tienda (Quality Shop).
// Se pega en un Worker de Cloudflare con el dominio img.qualityshopcol.com.
// Cloudflare guarda cada foto en su caché y solo la pide a Supabase la primera vez,
// así el tráfico de fotos deja de gastar el cupo de Supabase.
const ORIGIN = 'https://vymafzfwgeinsdfuivhd.supabase.co/storage/v1/object/public'

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Método no permitido', { status: 405 })

    const { pathname, search } = new URL(request.url)
    // Solo se sirven las fotos de la carpeta pública "productos", no cualquier cosa de Supabase
    if (!pathname.startsWith('/productos/')) return new Response('No encontrado', { status: 404 })

    const res = await fetch(ORIGIN + pathname + search, {
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 31536000, 404: 60, '500-599': 0 } },
    })
    const out = new Response(res.body, res)
    if (res.ok) out.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    out.headers.set('Access-Control-Allow-Origin', '*')
    return out
  },
}
