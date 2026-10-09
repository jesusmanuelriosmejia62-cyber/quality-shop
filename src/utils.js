export const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export const categoryLink = (title) => `#/categoria/${encodeURIComponent(title)}`
