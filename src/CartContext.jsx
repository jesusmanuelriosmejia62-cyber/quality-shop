import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'qs-cart'
const MAX_QTY = 10

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* sin almacenamiento disponible: el carrito funciona igual durante la visita */
    }
  }, [items])

  const add = useCallback((id, size, qty = 1, color = '') => {
    const key = `${id}-${size}-${color}`
    setItems((prev) => {
      const found = prev.find((i) => i.key === key)
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i))
      }
      return [...prev, { key, id, size, color, qty }]
    })
  }, [])

  const setQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, MAX_QTY)) } : i)),
    )
  }, [])

  const remove = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      maxQty: MAX_QTY,
    }),
    [items, add, setQty, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)