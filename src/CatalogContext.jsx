import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'

const CatalogContext = createContext(null)

// Convierte lo que viene de la base de datos a la forma que ya usa la página
function build(cats, prods) {
  const active = cats.filter((c) => c.active)
  const byId = new Map(cats.map((c) => [c.id, c]))

  // Si una categoría no tiene portada, se usa la foto de su primera prenda
  const firstPhoto = (ids) => prods.find((p) => p.active && ids.includes(p.category_id) && p.photos?.length)?.photos[0] ?? ''

  const categories = active
    .filter((c) => !c.parent_id)
    .map((c) => {
      const kids = active.filter((k) => k.parent_id === c.id)
      return {
        id: c.id,
        title: c.name,
        photo: c.photo_url || firstPhoto([c.id, ...kids.map((k) => k.id)]),
        children: kids.map((k) => ({ id: k.id, title: k.name, photo: k.photo_url || firstPhoto([k.id]) || c.photo_url || '' })),
      }
    })

  const products = prods
    .filter((p) => p.active)
    .map((row) => {
      const cat = byId.get(row.category_id)
      const parent = cat?.parent_id ? byId.get(cat.parent_id) : null
      const sizeRows = [...(row.product_sizes ?? [])].sort((a, b) => a.id - b.id)
      const colors = [...(row.product_colors ?? [])]
        .sort((a, b) => a.sort - b.sort || a.id - b.id)
        .map((c) => ({ name: c.name, hex: c.hex, photo: c.photos?.[0] ?? '', photos: c.photos ?? [] }))
      const photos = row.photos ?? []
      return {
        id: row.id,
        name: row.name,
        desc: row.description ?? '',
        price: row.price,
        cats: [cat?.name, parent?.name].filter(Boolean),
        sizes: sizeRows.map((s) => s.size),
        stock: Object.fromEntries(sizeRows.map((s) => [s.size, s.stock])),
        // Agotada: tiene tallas y todas están en 0
        soldOut: sizeRows.length > 0 && sizeRows.every((s) => s.stock <= 0),
        tag: row.tag || undefined,
        featured: row.featured,
        photo: photos[0] ?? '',
        photos,
        colors,
      }
    })

  return { categories, products }
}

export function CatalogProvider({ children }) {
  const [state, setState] = useState({ categories: [], products: [], looks: [], loading: !!supabase })

  const reload = useCallback(async () => {
    if (!supabase) return
    try {
      const [cats, prods] = await Promise.all([
        supabase.from('categories').select('*').order('sort').order('name'),
        supabase.from('products').select('*, product_sizes(*), product_colors(*)').order('created_at', { ascending: false }),
      ])
      if (cats.error) throw cats.error
      if (prods.error) throw prods.error
      // Los looks se piden aparte: si todavía no se creó la tabla, la tienda sigue funcionando
      const lk = await supabase.from('looks').select('*').eq('active', true).order('sort').order('id')
      const looks = (lk.error ? [] : lk.data).map((l) => ({ id: l.id, title: l.title, desc: l.description ?? '', photo: l.photo_url || '', productId: l.product_id }))
      setState({ ...build(cats.data, prods.data), looks, loading: false })
    } catch {
      setState({ categories: [], products: [], looks: [], loading: false })
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const value = useMemo(() => ({ ...state, reload }), [state, reload])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)
