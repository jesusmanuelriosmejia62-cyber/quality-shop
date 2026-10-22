import { useCallback, useEffect, useState } from 'react'
import { supabase, uploadImage } from '../supabase'
import { useCatalog } from '../CatalogContext'
import FloatingLogo from '../components/FloatingLogo'

const SIZE_PRESETS = {
  Ropa: ['S', 'M', 'L', 'XL'],
  Calzado: ['36', '37', '38', '39', '40', '41', '42', '43'],
  'Talla única': ['Única'],
}

const emptyProduct = () => ({
  name: '',
  description: '',
  price: '',
  category_id: '',
  tag: '',
  featured: false,
  active: true,
  cover: '',
  extra: [],
  sizes: [],
  colors: [],
})

// ---------- Fotos: subir varias, quitar y elegir la principal ----------
function PhotoList({ photos, onChange, showMain = true, addLabel = '+ Foto' }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const pick = async (e) => {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    setBusy(true)
    setError('')
    try {
      const urls = []
      for (const f of files) urls.push(await uploadImage(f))
      onChange([...photos, ...urls])
    } catch (err) {
      setError(err.message || 'No se pudo subir la foto')
    }
    setBusy(false)
  }

  return (
    <div className="adm-photos">
      {photos.map((u, i) => (
        <div key={u} className="adm-photo">
          <img src={u} alt="" />
          {showMain && i === 0 && <span className="adm-photo__main">Principal</span>}
          <div className="adm-photo__bar">
            {showMain && i > 0 && (
              <button type="button" onClick={() => onChange([u, ...photos.filter((x) => x !== u)])}>Principal</button>
            )}
            <button type="button" onClick={() => onChange(photos.filter((x) => x !== u))}>Quitar</button>
          </div>
        </div>
      ))}
      <label className="adm-photo adm-photo--add">
        <input type="file" accept="image/*" multiple onChange={pick} disabled={busy} hidden />
        {busy ? 'Subiendo…' : addLabel}
      </label>
      {error && <p className="adm-error">{error}</p>}
    </div>
  )
}

// ---------- Formulario de producto ----------
function ProductForm({ initial, cats, onSaved, onCancel }) {
  const [f, setF] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (patch) => setF((prev) => ({ ...prev, ...patch }))

  const catLabel = (c) => (c.parent_id ? `${cats.find((p) => p.id === c.parent_id)?.name ?? ''} › ${c.name}` : c.name)
  const catOptions = [...cats].sort((a, b) => catLabel(a).localeCompare(catLabel(b)))

  const save = async (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setError('Escribe el nombre de la prenda')
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: f.name.trim(),
        description: f.description.trim() || null,
        price: f.price === '' ? null : Number(f.price),
        category_id: f.category_id || null,
        tag: f.tag.trim() || null,
        featured: f.featured,
        active: f.active,
        photos: [f.cover, ...f.extra].filter(Boolean),
      }
      let id = f.id
      if (id) {
        const { error: err } = await supabase.from('products').update(payload).eq('id', id)
        if (err) throw err
      } else {
        const { data, error: err } = await supabase.from('products').insert(payload).select('id').single()
        if (err) throw err
        id = data.id
      }

      // Tallas y colores: se reemplazan por lo que hay en el formulario
      await supabase.from('product_sizes').delete().eq('product_id', id)
      const sizes = f.sizes
        .filter((s) => s.size.trim())
        .map((s) => ({ product_id: id, size: s.size.trim(), stock: Math.max(0, parseInt(s.stock, 10) || 0) }))
      if (sizes.length) {
        const { error: err } = await supabase.from('product_sizes').insert(sizes)
        if (err) throw err
      }

      await supabase.from('product_colors').delete().eq('product_id', id)
      const colors = f.colors
        .filter((c) => c.name.trim())
        .map((c, i) => ({ product_id: id, name: c.name.trim(), hex: c.hex || '#111111', photos: c.photos, sort: i }))
      if (colors.length) {
        const { error: err } = await supabase.from('product_colors').insert(colors)
        if (err) throw err
      }
      onSaved()
    } catch (err) {
      setError(err.message || 'No se pudo guardar')
      setSaving(false)
    }
  }

  const addSizes = (list) => {
    const have = new Set(f.sizes.map((s) => s.size))
    set({ sizes: [...f.sizes, ...list.filter((s) => !have.has(s)).map((s) => ({ size: s, stock: 0 }))] })
  }

  return (
    <form className="adm-form" onSubmit={save}>
      <h2>{f.id ? 'Editar prenda' : 'Nueva prenda'}</h2>

      <label>Nombre
        <input value={f.name} onChange={(e) => set({ name: e.target.value })} required />
      </label>
      <label>Descripción
        <textarea rows="3" value={f.description} onChange={(e) => set({ description: e.target.value })} />
      </label>
      <div className="adm-row">
        <label>Precio (pesos, vacío = "Consultar precio")
          <input type="number" min="0" max="100000000" step="100" value={f.price} onChange={(e) => set({ price: e.target.value })} />
        </label>
        <label>Categoría
          <select value={f.category_id} onChange={(e) => set({ category_id: e.target.value })}>
            <option value="">Sin categoría</option>
            {catOptions.map((c) => (
              <option key={c.id} value={c.id}>{catLabel(c)}</option>
            ))}
          </select>
        </label>
        <label>Etiqueta (Nuevo, Más vendido…)
          <input value={f.tag} onChange={(e) => set({ tag: e.target.value })} maxLength={20} />
        </label>
      </div>
      <div className="adm-row">
        <label className="adm-check"><input type="checkbox" checked={f.active} onChange={(e) => set({ active: e.target.checked })} /> Visible en la tienda</label>
      </div>

      <h3>Portada</h3>
      <p className="adm-help">Es la foto principal de la prenda: sale en el inicio, en el carrusel, en las tarjetas y como foto grande en su página. Mejor vertical (4:5). Si subes otra, reemplaza a la anterior.</p>
      <PhotoList photos={f.cover ? [f.cover] : []} onChange={(p) => set({ cover: p[p.length - 1] ?? '' })} showMain={false} addLabel="+ Portada" />

      <h3>Fotos secundarias</h3>
      <p className="adm-help">Otros lados de la prenda (espalda, detalle, puesta…). En la página salen en una columna al lado de la foto grande y el cliente las toca para verlas.</p>
      <PhotoList photos={f.extra} onChange={(extra) => set({ extra })} showMain={false} addLabel="+ Foto" />

      <h3>Tallas y cantidades</h3>
      <p className="adm-help">Cuando todas las tallas llegan a 0, la prenda aparece como "Agotado" en la página.</p>
      <div className="adm-presets">
        {Object.entries(SIZE_PRESETS).map(([name, list]) => (
          <button key={name} type="button" onClick={() => addSizes(list)}>+ {name}</button>
        ))}
      </div>
      {f.sizes.map((s, i) => (
        <div key={i} className="adm-size">
          <input value={s.size} onChange={(e) => set({ sizes: f.sizes.map((x, j) => (j === i ? { ...x, size: e.target.value } : x)) })} placeholder="Talla" />
          <input type="number" min="0" value={s.stock} onChange={(e) => set({ sizes: f.sizes.map((x, j) => (j === i ? { ...x, stock: e.target.value } : x)) })} placeholder="Cantidad" />
          <button type="button" onClick={() => set({ sizes: f.sizes.filter((_, j) => j !== i) })}>Quitar</button>
        </div>
      ))}
      <button type="button" className="adm-small" onClick={() => set({ sizes: [...f.sizes, { size: '', stock: 0 }] })}>+ Otra talla</button>

      <h3>Colores</h3>
      <p className="adm-help">Cada color puede tener sus propias fotos (la principal y las secundarias). Al elegir el color en la página, cambian todas.</p>
      {f.colors.map((c, i) => (
        <div key={i} className="adm-color">
          <div className="adm-color__top">
            <input type="color" value={c.hex} onChange={(e) => set({ colors: f.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)) })} aria-label="Color" />
            <input value={c.name} onChange={(e) => set({ colors: f.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })} placeholder="Nombre (Negro, Blanco…)" />
            <button type="button" onClick={() => set({ colors: f.colors.filter((_, j) => j !== i) })}>Quitar color</button>
          </div>
          <PhotoList photos={c.photos} onChange={(photos) => set({ colors: f.colors.map((x, j) => (j === i ? { ...x, photos } : x)) })} />
        </div>
      ))}
      <button type="button" className="adm-small" onClick={() => set({ colors: [...f.colors, { name: '', hex: '#111111', photos: [] }] })}>+ Agregar color</button>

      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-actions">
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

// ---------- Formulario de categoría ----------
function CategoryForm({ initial, cats, onSaved, onCancel }) {
  const [f, setF] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (patch) => setF((prev) => ({ ...prev, ...patch }))

  const save = async (e) => {
    e.preventDefault()
    if (!f.name.trim()) return setError('Escribe el nombre')
    setSaving(true)
    setError('')
    const payload = {
      name: f.name.trim(),
      parent_id: f.parent_id || null,
      photo_url: f.photo_url || null,
      sort: parseInt(f.sort, 10) || 0,
      active: f.active,
    }
    const { error: err } = f.id
      ? await supabase.from('categories').update(payload).eq('id', f.id)
      : await supabase.from('categories').insert(payload)
    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    onSaved()
  }

  const mains = cats.filter((c) => !c.parent_id && c.id !== f.id)

  return (
    <form className="adm-form" onSubmit={save}>
      <h2>{f.id ? 'Editar categoría' : 'Nueva categoría'}</h2>
      <label>Nombre
        <input value={f.name} onChange={(e) => set({ name: e.target.value })} required />
      </label>
      <label>Es un tipo dentro de… (déjalo vacío si es una categoría principal)
        <select value={f.parent_id ?? ''} onChange={(e) => set({ parent_id: e.target.value })}>
          <option value="">Categoría principal</option>
          {mains.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>
      <div className="adm-row">
        <label>Orden (menor sale primero)
          <input type="number" value={f.sort} onChange={(e) => set({ sort: e.target.value })} />
        </label>
        <label className="adm-check"><input type="checkbox" checked={f.active} onChange={(e) => set({ active: e.target.checked })} /> Visible en la tienda</label>
      </div>
      <h3>Portada de la categoría</h3>
      <p className="adm-help">Es la foto grande que sale en el inicio, en el menú y arriba de la página de la categoría. Mejor vertical (4:5, por ejemplo 1200 x 1500 px). Si subes otra, reemplaza a la anterior. Si no subes ninguna, sale el recuadro negro con el oso.</p>
      <PhotoList photos={f.photo_url ? [f.photo_url] : []} onChange={(p) => set({ photo_url: p[p.length - 1] ?? '' })} />
      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-actions">
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

// ---------- Formulario de look ----------
function LookForm({ initial, prods, onSaved, onCancel }) {
  const [f, setF] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (patch) => setF((prev) => ({ ...prev, ...patch }))

  const save = async (e) => {
    e.preventDefault()
    if (!f.title.trim()) return setError('Escribe el título del look')
    if (!f.photo_url) return setError('Sube la foto del look')
    setSaving(true)
    setError('')
    const payload = {
      title: f.title.trim(),
      description: f.description.trim() || null,
      photo_url: f.photo_url,
      product_id: f.product_id ? Number(f.product_id) : null,
      sort: parseInt(f.sort, 10) || 0,
      active: f.active,
    }
    const { error: err } = f.id
      ? await supabase.from('looks').update(payload).eq('id', f.id)
      : await supabase.from('looks').insert(payload)
    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }
    onSaved()
  }

  return (
    <form className="adm-form" onSubmit={save}>
      <h2>{f.id ? 'Editar look' : 'Nuevo look'}</h2>
      <label>Título
        <input value={f.title} onChange={(e) => set({ title: e.target.value })} maxLength={60} required />
      </label>
      <label>Texto corto (opcional)
        <input value={f.description} onChange={(e) => set({ description: e.target.value })} maxLength={90} />
      </label>
      <label>Prenda a la que lleva (opcional)
        <select value={f.product_id} onChange={(e) => set({ product_id: e.target.value })}>
          <option value="">Ninguna: lleva a toda la colección</option>
          {prods.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>
      <div className="adm-row">
        <label>Orden (menor sale primero)
          <input type="number" value={f.sort} onChange={(e) => set({ sort: e.target.value })} />
        </label>
        <label className="adm-check"><input type="checkbox" checked={f.active} onChange={(e) => set({ active: e.target.checked })} /> Visible en la tienda</label>
      </div>
      <h3>Foto del look</h3>
      <p className="adm-help">La foto completa del outfit. Mejor vertical (4:5). Si subes otra, reemplaza a la anterior.</p>
      <PhotoList photos={f.photo_url ? [f.photo_url] : []} onChange={(p) => set({ photo_url: p[p.length - 1] ?? '' })} showMain={false} addLabel="+ Foto" />
      {error && <p className="adm-error" role="alert">{error}</p>}
      <div className="adm-actions">
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

// ---------- Inicio de sesión ----------
function Login({ onError }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError('Correo o contraseña incorrectos')
    onError?.(err)
    setBusy(false)
  }

  return (
    <form className="adm-login" onSubmit={submit}>
      <h1>Panel de administración</h1>
      <p>Quality Shop</p>
      <label>Correo
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>Contraseña
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="adm-error" role="alert">{error}</p>}
      <button type="submit" className="btn" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
    </form>
  )
}

// ---------- Panel ----------
// Con el logo de la marca flotando en el fondo
export default function AdminPage() {
  return (
    <div className="adm-shell has-floatlogo">
      <FloatingLogo className="floatlogo--right" />
      <FloatingLogo className="floatlogo--left floatlogo--low" />
      <AdminInner />
    </div>
  )
}

function AdminInner() {
  const { reload } = useCatalog()
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(null)
  const [tab, setTab] = useState('productos')
  const [cats, setCats] = useState([])
  const [prods, setProds] = useState([])
  const [looks, setLooks] = useState([])
  const [looksMissing, setLooksMissing] = useState(false)
  const [editing, setEditing] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const load = useCallback(async () => {
    const [c, p] = await Promise.all([
      supabase.from('categories').select('*').order('sort').order('name'),
      supabase.from('products').select('*, product_sizes(*), product_colors(*)').order('created_at', { ascending: false }),
    ])
    setCats(c.data ?? [])
    setProds(p.data ?? [])
    const l = await supabase.from('looks').select('*').order('sort').order('id')
    setLooksMissing(!!l.error)
    setLooks(l.error ? [] : l.data)
  }, [])

  useEffect(() => {
    if (!session) return
    supabase.rpc('is_admin').then(({ data }) => {
      setIsAdmin(!!data)
      if (data) load()
    })
  }, [session, load])

  const done = async (text) => {
    setEditing(null)
    setMsg(text)
    await load()
    reload()
  }

  if (!supabase) {
    return <main className="adm"><p className="adm-error">Falta conectar la base de datos (archivo .env).</p></main>
  }
  if (session === undefined) return <main className="adm"><p>Cargando…</p></main>
  if (!session) return <main className="adm"><Login /></main>
  if (isAdmin === null) return <main className="adm"><p>Cargando…</p></main>
  if (!isAdmin) {
    return (
      <main className="adm">
        <p className="adm-error">Esta cuenta no tiene permiso de administrador.</p>
        <button type="button" className="btn" onClick={() => supabase.auth.signOut()}>Salir</button>
      </main>
    )
  }

  const catName = (id) => {
    const c = cats.find((x) => x.id === id)
    if (!c) return 'Sin categoría'
    const p = c.parent_id ? cats.find((x) => x.id === c.parent_id) : null
    return p ? `${p.name} › ${c.name}` : c.name
  }

  const editProduct = (p) =>
    setEditing({
      kind: 'product',
      data: {
        id: p.id,
        name: p.name,
        description: p.description ?? '',
        price: p.price ?? '',
        category_id: p.category_id ?? '',
        tag: p.tag ?? '',
        featured: p.featured,
        active: p.active,
        cover: p.photos?.[0] ?? '',
        extra: (p.photos ?? []).slice(1),
        sizes: [...(p.product_sizes ?? [])].sort((a, b) => a.id - b.id).map((s) => ({ size: s.size, stock: s.stock })),
        colors: [...(p.product_colors ?? [])].sort((a, b) => a.sort - b.sort).map((c) => ({ name: c.name, hex: c.hex, photos: c.photos ?? [] })),
      },
    })

  const removeProduct = async (p) => {
    if (!window.confirm(`¿Borrar "${p.name}" para siempre?`)) return
    await supabase.from('products').delete().eq('id', p.id)
    done('Prenda borrada')
  }

  const removeLook = async (l) => {
    if (!window.confirm(`¿Borrar el look "${l.title}"?`)) return
    await supabase.from('looks').delete().eq('id', l.id)
    done('Look borrado')
  }

  const removeCategory = async (c) => {
    if (!window.confirm(`¿Borrar la categoría "${c.name}"? Sus tipos también se borran y sus prendas quedan sin categoría.`)) return
    await supabase.from('categories').delete().eq('id', c.id)
    done('Categoría borrada')
  }

  return (
    <main className="adm">
      <header className="adm-top">
        <h1>Panel de administración</h1>
        <div>
          <a href="#/" className="adm-link">Ver la tienda</a>
          <button type="button" className="adm-link" onClick={() => supabase.auth.signOut()}>Salir</button>
        </div>
      </header>

      {editing?.kind === 'product' && (
        <ProductForm initial={editing.data} cats={cats} onSaved={() => done('Prenda guardada')} onCancel={() => setEditing(null)} />
      )}
      {editing?.kind === 'look' && (
        <LookForm initial={editing.data} prods={prods} onSaved={() => done('Look guardado')} onCancel={() => setEditing(null)} />
      )}
      {editing?.kind === 'category' && (
        <CategoryForm initial={editing.data} cats={cats} onSaved={() => done('Categoría guardada')} onCancel={() => setEditing(null)} />
      )}

      {!editing && (
        <>
          <nav className="adm-tabs">
            <button type="button" className={tab === 'productos' ? 'on' : ''} onClick={() => setTab('productos')}>Prendas ({prods.length})</button>
            <button type="button" className={tab === 'categorias' ? 'on' : ''} onClick={() => setTab('categorias')}>Categorías ({cats.length})</button>
            <button type="button" className={tab === 'looks' ? 'on' : ''} onClick={() => setTab('looks')}>Looks ({looks.length})</button>
          </nav>
          {msg && <p className="adm-ok" role="status">{msg}</p>}

          {tab === 'productos' && (
            <section>
              <button type="button" className="btn" onClick={() => setEditing({ kind: 'product', data: emptyProduct() })}>+ Nueva prenda</button>
              <ul className="adm-list">
                {prods.map((p) => {
                  const sizes = p.product_sizes ?? []
                  const out = sizes.length > 0 && sizes.every((s) => s.stock <= 0)
                  return (
                    <li key={p.id}>
                      <img src={p.photos?.[0] || undefined} alt="" />
                      <div className="adm-list__info">
                        <strong>{p.name}</strong>
                        <small>{catName(p.category_id)}{p.price ? ` · $${Number(p.price).toLocaleString('es-CO')}` : ''}</small>
                        <small>
                          {sizes.map((s) => `${s.size}:${s.stock}`).join('  ') || 'Sin tallas'}
                          {out && <b className="adm-badge adm-badge--out">Agotado</b>}
                          {!p.active && <b className="adm-badge">Oculta</b>}
                          {p.featured && <b className="adm-badge adm-badge--ok">Destacada</b>}
                        </small>
                      </div>
                      <button type="button" onClick={() => editProduct(p)}>Editar</button>
                      <button type="button" onClick={() => removeProduct(p)}>Borrar</button>
                    </li>
                  )
                })}
                {prods.length === 0 && <li className="adm-empty">Todavía no hay prendas. Agrega la primera.</li>}
              </ul>
            </section>
          )}

          {tab === 'looks' && (
            <section>
              {looksMissing ? (
                <p className="adm-error">Falta crear la tabla de looks. En Supabase abre SQL Editor, pega el contenido del archivo supabase/looks.sql y pulsa Run. Luego recarga esta página.</p>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setEditing({ kind: 'look', data: { title: '', description: '', photo_url: '', product_id: '', sort: looks.length, active: true } })}
                  >
                    + Nuevo look
                  </button>
                  <ul className="adm-list">
                    {looks.map((l) => (
                      <li key={l.id}>
                        <img src={l.photo_url || undefined} alt="" />
                        <div className="adm-list__info">
                          <strong>{l.title}</strong>
                          <small>
                            {l.product_id ? `Lleva a: ${prods.find((x) => x.id === l.product_id)?.name ?? 'una prenda'}` : 'Lleva a la colección'}
                            {!l.active && <b className="adm-badge">Oculto</b>}
                          </small>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditing({ kind: 'look', data: { id: l.id, title: l.title, description: l.description ?? '', photo_url: l.photo_url ?? '', product_id: l.product_id ?? '', sort: l.sort, active: l.active } })}
                        >
                          Editar
                        </button>
                        <button type="button" onClick={() => removeLook(l)}>Borrar</button>
                      </li>
                    ))}
                    {looks.length === 0 && <li className="adm-empty">Todavía no hay looks. Agrega el primero y saldrá en "Looks aprobados" del inicio.</li>}
                  </ul>
                </>
              )}
            </section>
          )}

          {tab === 'categorias' && (
            <section>
              <button
                type="button"
                className="btn"
                onClick={() => setEditing({ kind: 'category', data: { name: '', parent_id: '', photo_url: '', sort: cats.length, active: true } })}
              >
                + Nueva categoría
              </button>
              <ul className="adm-list">
                {cats
                  .filter((c) => !c.parent_id)
                  .flatMap((c) => [c, ...cats.filter((k) => k.parent_id === c.id)])
                  .map((c) => (
                    <li key={c.id} className={c.parent_id ? 'adm-list__sub' : ''}>
                      <img src={c.photo_url || undefined} alt="" />
                      <div className="adm-list__info">
                        <strong>{c.parent_id ? '↳ ' : ''}{c.name}</strong>
                        <small>{prods.filter((p) => p.category_id === c.id).length} prendas{!c.active ? ' · oculta' : ''}</small>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditing({ kind: 'category', data: { id: c.id, name: c.name, parent_id: c.parent_id ?? '', photo_url: c.photo_url ?? '', sort: c.sort, active: c.active } })}
                      >
                        Editar
                      </button>
                      <button type="button" onClick={() => removeCategory(c)}>Borrar</button>
                    </li>
                  ))}
                {cats.length === 0 && <li className="adm-empty">Todavía no hay categorías.</li>}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  )
}
