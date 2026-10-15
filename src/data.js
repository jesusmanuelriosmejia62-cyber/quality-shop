// Ruta del logo que respeta la carpeta donde se publica la web (GitHub Pages usa /quality-shop/)
export const logo = `${import.meta.env.BASE_URL}logo.png`

export const business = {
  name: 'Quality Shop Col',
  city: 'Ocaña, Norte de Santander',
  // Número con indicativo, sin + ni espacios. Ejemplo: 573001234567
  whatsapp: '570000000000',
  whatsappMessage: 'Hola Quality Shop, quiero ver las pintas disponibles 👋',
  tiktok: 'https://www.tiktok.com/@qualityshop__col',
  instagram: 'https://www.instagram.com/qualityshop___col___/', // confirmar el usuario con el dueño
  facebook: '', // déjalo vacío si no tienen
}

const img = (id, w = 800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

const ROPA = ['S', 'M', 'L', 'XL']
const CALZ = ['36', '37', '38', '39', '40', '41', '42', '43']

// Fotos del local: copia cada archivo en public/img/categorias/ con el nombre indicado aquí.
// Mientras no existan, la web muestra un recuadro negro con el logo.
const local = (file) => `${import.meta.env.BASE_URL}img/categorias/${file}`

export const categories = [
  { title: 'Camisetas', photo: local('camisetas.jpg') },
  { title: 'Busos y hoodies', photo: local('busos-hoodies.jpg') },
  { title: 'Chaquetas', photo: local('chaquetas.jpg') },
  { title: 'Tenis', photo: local('tenis.jpg') },
  { title: 'Mujer', photo: local('mujer.jpg') },
  { title: 'Hombre', photo: local('hombre.jpg') },
]

// Prendas de EJEMPLO. Cámbialas por las reales.
// cats: en qué categorías aparece (deben coincidir con `categories`)
// price: número en pesos (ej. 89900) o null para mostrar "Consultar precio"
// details: lista corta de características (opcional)
export const products = [
  { id: 1, name: 'Camiseta Oversize Negra', cats: ['Camisetas', 'Hombre'], price: null, sizes: ROPA, tag: 'Nuevo', photo: img('photo-1517466787929-bc90951d0974', 1000),
    desc: 'Corte oversize para una pinta relajada que combina con todo. Tela suave y fresca, ideal para el clima de Ocaña.',
    details: ['Corte oversize', 'Algodón suave', 'Color negro'] },
  { id: 2, name: 'Camiseta Básica Blanca', cats: ['Camisetas', 'Mujer'], price: null, sizes: ROPA, photo: img('photo-1518459031867-a89b944bffe4', 1000),
    desc: 'La básica que nunca falla. Se ve bien sola o debajo de una chaqueta, y no pasa de moda.',
    details: ['Corte regular', 'Algodón', 'Color blanco'] },
  { id: 3, name: 'Camiseta Estampada', cats: ['Camisetas', 'Hombre'], price: null, sizes: ROPA, photo: img('photo-1571008887538-b36bb32f4571', 1000),
    desc: 'Estampado con carácter para quien quiere destacar sin esfuerzo. Cómoda para todo el día.',
    details: ['Estampado frontal', 'Algodón', 'Corte regular'] },
  { id: 4, name: 'Hoodie Negro Clásico', cats: ['Busos y hoodies', 'Hombre'], price: null, sizes: ROPA, tag: 'Más vendido', photo: img('photo-1556905055-8f358a7a47b2', 1000),
    desc: 'El hoodie de siempre: capota ajustable, bolsillo canguro y un interior abrigado que se siente bien desde el primer día.',
    details: ['Capota ajustable', 'Bolsillo canguro', 'Interior afelpado'] },
  { id: 5, name: 'Buzo Urbano', cats: ['Busos y hoodies', 'Mujer'], price: null, sizes: ROPA, photo: img('photo-1560012057-4372e14c5085', 1000),
    desc: 'Buzo cómodo y con estilo para las noches frescas. Fácil de combinar con jeans o pantalón deportivo.',
    details: ['Cuello redondo', 'Tela suave', 'Corte holgado'] },
  { id: 6, name: 'Chaqueta Cortaviento', cats: ['Chaquetas', 'Hombre'], price: null, sizes: ROPA, photo: img('photo-1551028719-00167b16eac5', 1000),
    desc: 'Liviana y resistente al viento. Cabe en cualquier maleta y te saca de apuros cuando cambia el clima.',
    details: ['Tela liviana', 'Cierre frontal', 'Bolsillos laterales'] },
  { id: 7, name: 'Chaqueta Ligera', cats: ['Chaquetas', 'Mujer'], price: null, sizes: ROPA, tag: 'Nuevo', photo: img('photo-1506629082955-511b1aa562c8', 1000),
    desc: 'Chaqueta ligera de diseño actual. Perfecta para completar una pinta casual sin dar calor.',
    details: ['Tela ligera', 'Cierre frontal', 'Corte ajustado'] },
  { id: 8, name: 'Tenis Blancos Clásicos', cats: ['Tenis', 'Hombre'], price: null, sizes: CALZ, tag: 'Más vendido', photo: img('photo-1552346154-21d32810aba3', 1000),
    desc: 'El clásico blanco que va con todo. Cómodos para caminar y con un diseño que no pasa de moda.',
    details: ['Suela cómoda', 'Color blanco', 'Uso diario'] },
  { id: 9, name: 'Tenis Negros Running', cats: ['Tenis', 'Hombre'], price: null, sizes: CALZ, photo: img('photo-1608231387042-66d1773070a5', 1000),
    desc: 'Livianos y con buen agarre, pensados para moverte. También se ven muy bien en el día a día.',
    details: ['Livianos', 'Suela con agarre', 'Color negro'] },
  { id: 10, name: 'Tenis Rosa', cats: ['Tenis', 'Mujer'], price: null, sizes: CALZ, photo: img('photo-1595950653106-6c9ebd614d3a', 1000),
    desc: 'Color que se nota y comodidad que se siente. Un toque fresco para tus pintas de todos los días.',
    details: ['Suela cómoda', 'Color rosa', 'Uso diario'] },
  { id: 11, name: 'Tenis Azul Sport', cats: ['Tenis', 'Hombre', 'Mujer'], price: null, sizes: CALZ, photo: img('photo-1542291026-7eec264c27ff', 1000),
    desc: 'Diseño deportivo con mucha personalidad. Ligeros y cómodos, para hombre y mujer.',
    details: ['Diseño deportivo', 'Ligeros', 'Unisex'] },
]

// Comentarios de EJEMPLO para la demo. Bórralos antes de publicar la web real.
export const sampleReviews = [
  { name: 'Cliente de ejemplo', rating: 5, text: 'Llegó rápido y la calidad se nota. Muy buena atención por WhatsApp.', date: '2026-09-12' },
  { name: 'Cliente de ejemplo', rating: 4, text: 'La talla me quedó perfecta. Recomendado.', date: '2026-09-28' },
]

export const steps = [
  { title: 'Eliges tu prenda', text: 'Mira lo nuevo en nuestro TikTok o visítanos en el local.' },
  { title: 'Nos escribes', text: 'Por WhatsApp te confirmamos tallas, colores y disponibilidad.' },
  { title: 'Pagas y la recibes', text: 'Pagas por el método que prefieras y te la enviamos.' },
]

export const shipping = {
  coverage: 'Enviamos a toda Colombia.',
  details: [
    'Transportadora: por confirmar',
    'Tiempo de entrega: por confirmar',
    'Costo del envío: por confirmar',
  ],
}

// Métodos de pago por confirmar con el dueño
export const payments = ['Nequi', 'Daviplata', 'Transferencia', 'Contra entrega']

export const visit = {
  address: 'Dirección por confirmar, Ocaña, Norte de Santander',
  hours: ['Lunes a sábado: por confirmar', 'Domingos: por confirmar'],
  // Cuando tengas la dirección exacta, cámbiala aquí para que el mapa quede preciso
  mapQuery: 'Ocaña, Norte de Santander, Colombia',
}

// Sin argumento usa el mensaje general; con argumento usa un mensaje propio
export const whatsappLink = (message = business.whatsappMessage) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`
