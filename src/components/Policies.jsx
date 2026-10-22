import { business, legal, visit, whatsappLink } from '../data'

const Privacy = () => (
  <>
    <p>
      En {business.name} cuidamos tus datos personales. Esta política explica qué información recolectamos, para qué la usamos y cómo puedes
      ejercer tus derechos, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 (protección de datos personales en Colombia).
    </p>

    <h2>1. Responsable del tratamiento</h2>
    <ul>
      <li><strong>Responsable:</strong> {legal.owner}, {legal.id}, titular del establecimiento {business.name}.</li>
      <li><strong>Dirección:</strong> {visit.address}.</li>
      <li><strong>Correo:</strong> <a href={`mailto:${legal.email}`}>{legal.email}</a></li>
      <li><strong>WhatsApp:</strong> <a href={whatsappLink()} target="_blank" rel="noreferrer">+{business.whatsapp}</a></li>
    </ul>

    <h2>2. Datos que recolectamos</h2>
    <p>Solo los que escribes en el carrito al hacer un pedido: nombre, celular, país, departamento, ciudad, dirección, barrio o referencia, método de pago y notas del pedido.</p>
    <p>No pedimos ni guardamos números de tarjetas ni claves bancarias en esta página. El pago se coordina directamente por WhatsApp.</p>

    <h2>3. Para qué los usamos</h2>
    <ul>
      <li>Armar tu pedido y enviarlo a nuestro WhatsApp.</li>
      <li>Confirmar disponibilidad, valor del envío y forma de pago.</li>
      <li>Despachar tu compra y atender cambios o reclamos.</li>
    </ul>
    <p>No vendemos ni compartimos tus datos con terceros, salvo la empresa transportadora que necesite tu dirección para entregarte el pedido, o cuando una autoridad lo exija.</p>

    <h2>4. Cómo se envían tus datos</h2>
    <p>
      Al pulsar «Pedir por WhatsApp», el mensaje con tus datos se abre en tu WhatsApp y tú decides enviarlo. Esa conversación queda sujeta
      además a las políticas de WhatsApp. Esta página no almacena tus datos de entrega en ningún servidor.
    </p>
    <p>
      Los comentarios que dejas en cada prenda se guardan solo en tu propio dispositivo. Para mostrar el catálogo usamos el servicio de
      base de datos Supabase, que almacena únicamente las prendas, categorías y fotos de la tienda.
    </p>

    <h2>5. Tus derechos</h2>
    <p>Como titular puedes conocer, actualizar, rectificar y solicitar la supresión de tus datos, y revocar la autorización que diste. Escríbenos a <a href={`mailto:${legal.email}`}>{legal.email}</a> o por WhatsApp y respondemos en un máximo de 15 días hábiles.</p>

    <h2>6. Conservación</h2>
    <p>Guardamos tus datos solo el tiempo necesario para atender tu pedido y las obligaciones legales aplicables. Después los eliminamos.</p>

    <h2>7. Cambios a esta política</h2>
    <p>Si la actualizamos, publicaremos la nueva versión en esta página con su fecha.</p>
  </>
)

const Exchanges = () => (
  <>
    <p>Queremos que quedes feliz con tu compra. Así funcionan los cambios en {business.name}.</p>

    <h2>1. Cambios</h2>
    <ul>
      <li>Tienes <strong>{legal.exchangeDays} días hábiles</strong> contados desde que recibes la prenda para solicitar un cambio.</li>
      <li>La prenda debe estar <strong>en perfecto estado</strong>: sin usar, sin lavar, sin olores, sin manchas ni daños, con sus etiquetas.</li>
      <li>El cambio es por otra talla, color o prenda, según disponibilidad.</li>
    </ul>

    <h2>2. Cómo solicitarlo</h2>
    <ol>
      <li>Escríbenos por <a href={whatsappLink('Hola, quiero solicitar un cambio de mi pedido.')} target="_blank" rel="noreferrer">WhatsApp</a> dentro del plazo, con tu nombre y la prenda.</li>
      <li>Revisamos el estado de la prenda y te confirmamos el cambio.</li>
      <li>Nos la haces llegar (en la tienda o por envío) y te entregamos la nueva.</li>
    </ol>
    <p>Si el cambio se debe a una preferencia tuya (talla, color o gusto), el costo del envío de ida y vuelta lo asumes tú. Si la prenda llegó defectuosa o no es la que pediste, lo asumimos nosotros.</p>

    <h2>3. Prendas con defecto</h2>
    <p>Si la prenda llega con un defecto de fábrica o diferente a lo ofrecido, aplica la garantía legal del Estatuto del Consumidor (Ley 1480 de 2011). Avísanos de inmediato por WhatsApp con fotos.</p>

    <h2>4. Derecho de retracto</h2>
    <p>
      Si compras a distancia (por esta página y WhatsApp) tienes derecho de retracto de <strong>5 días hábiles</strong> desde la entrega,
      conforme al artículo 47 de la Ley 1480 de 2011. La prenda debe devolverse en el mismo estado en que se recibió, y los costos de
      transporte de la devolución corren por cuenta del comprador.
    </p>
  </>
)

const Terms = () => (
  <>
    <p>Al usar esta página y hacer pedidos aceptas estas condiciones.</p>

    <h2>1. Quiénes somos</h2>
    <p>{business.name} es un establecimiento de comercio de ropa en {business.city}, a cargo de {legal.owner}, {legal.id}. Ubicación: {visit.address}.</p>

    <h2>2. Cómo funciona la compra</h2>
    <ul>
      <li>Esta página es un catálogo. Al armar tu carrito y pulsar «Pedir por WhatsApp», se abre un mensaje con tu pedido; la compra no está cerrada hasta que la confirmemos por ese medio.</li>
      <li>No cobramos nada dentro de la página. El pago se coordina por WhatsApp con los métodos que mostramos.</li>
      <li>Confirmamos disponibilidad, costo de envío y tiempos antes de despachar.</li>
    </ul>

    <h2>3. Precios y disponibilidad</h2>
    <p>Los precios están en pesos colombianos (COP). Las cantidades son limitadas y pueden cambiar sin previo aviso; si una prenda se agota después de tu pedido, te lo informamos y puedes elegir otra o cancelar.</p>

    <h2>4. Envíos</h2>
    <p>Los envíos, coberturas y tiempos se detallan en la sección «Envíos y pagos» y se confirman por WhatsApp para cada pedido.</p>

    <h2>5. Cambios y devoluciones</h2>
    <p>Se rigen por nuestra <a href="#/politicas/cambios">política de cambios</a>.</p>

    <h2>6. Imágenes</h2>
    <p>Los colores pueden verse distintos según la pantalla de cada dispositivo. Las fotos, el logo y los textos de esta página pertenecen a {business.name} y no se pueden usar sin autorización.</p>

    <h2>7. Datos personales</h2>
    <p>El tratamiento de tus datos se explica en la <a href="#/politicas/privacidad">política de privacidad</a>.</p>

    <h2>8. Ley aplicable</h2>
    <p>Estas condiciones se rigen por las leyes de Colombia.</p>
  </>
)

const pages = {
  privacidad: { title: 'Política de privacidad', Body: Privacy },
  cambios: { title: 'Cambios y devoluciones', Body: Exchanges },
  terminos: { title: 'Términos y condiciones', Body: Terms },
}

export default function Policies({ kind }) {
  const page = pages[kind] ?? pages.privacidad
  const { Body } = page
  return (
    <main className="section section--soft policy">
      <div className="container policy__wrap">
        <a href="#" className="crumb">← Volver a la tienda</a>
        <nav className="policy__tabs" aria-label="Políticas">
          {Object.entries(pages).map(([key, p]) => (
            <a key={key} href={`#/politicas/${key}`} className={pages[kind] === p || (!pages[kind] && key === 'privacidad') ? 'on' : ''}>
              {p.title}
            </a>
          ))}
        </nav>
        <article className="policy__body">
          <h1>{page.title}</h1>
          <p className="policy__date">Última actualización: {legal.updated}</p>
          <Body />
        </article>
      </div>
    </main>
  )
}
