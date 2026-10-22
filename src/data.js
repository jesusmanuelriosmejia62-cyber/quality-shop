// Ruta del logo que respeta la carpeta donde se publica la web (GitHub Pages usa /quality-shop/)
export const logo = `${import.meta.env.BASE_URL}logo.png`

export const business = {
  name: 'Quality Shop Col',
  city: 'Ocaña, Norte de Santander',
  // Número con indicativo, sin + ni espacios. Ejemplo: 573001234567
  whatsapp: '573248627580',
  whatsappMessage: 'Hola Quality Shop, quiero ver las pintas disponibles 👋',
  tiktok: 'https://www.tiktok.com/@qualityshop__col',
  instagram: 'https://www.instagram.com/qualityshop__col/',
  facebook: '', // déjalo vacío si no tienen
}

// Las prendas, las categorías y sus fotos ya no están aquí: se administran desde el panel (#/admin) y viven en Supabase.

export const steps = [
  { title: 'Eliges tu prenda', text: 'Mira lo nuevo en nuestro TikTok o visítanos en el local.' },
  { title: 'Nos escribes', text: 'Por WhatsApp te confirmamos tallas, colores y disponibilidad.' },
  { title: 'Pagas y la recibes', text: 'Pagas por el método que prefieras y te la enviamos.' },
]

export const shipping = {
  coverage: 'Enviamos a toda Colombia.',
  details: [
    'Transportadora: cliente a elegir',
    'Tiempo de entrega: transportadora',
    'Costo del envío: segun la ubicacion',
  ],
}

// Métodos de pago por confirmar con el dueño
// logo: archivo dentro de public/pagos/ (si no existe, se muestra el nombre en texto)
// shape: "circle" (logo redondo), "square" (esquinas suaves) o "free" (tal cual)
export const payments = [
  { name: 'Bancolombia', logo: 'pagos/bancolombia.png', shape: 'circle' },
  { name: 'Tarjetas crédito y débito (Visa y Mastercard)', logo: 'pagos/tarjetas.png', shape: 'free' },
  { name: 'Sistecrédito', logo: 'pagos/sistecredito.png', shape: 'square' },
  { name: 'Addi', logo: 'pagos/addi.jpg', shape: 'circle' },
]

export const visit = {
  address: 'Centro Comercial City Gold, local 107 — Calle 11, Ocaña, Norte de Santander',
  hours: ['Lunes a sábado: 9am a 12:30 y 2 a 7pm', 'Domingos: 9 a 12:30'],
  // Cuando tengas la dirección exacta, cámbiala aquí para que el mapa quede preciso
  mapQuery: 'Centro Comercial City Gold, Calle 11, Ocaña, Norte de Santander, Colombia',
}

// Sin argumento usa el mensaje general; con argumento usa un mensaje propio
export const whatsappLink = (message = business.whatsappMessage) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`

// Datos del responsable de la tienda (se usan en las políticas legales)
export const legal = {
  owner: 'Juan José Sanguino Lobo',
  id: 'C.C. 1004819124',
  email: 'Sanguinolobojuanjo@gmail.com',
  exchangeDays: 3,
  updated: '22 de octubre de 2026',
}
