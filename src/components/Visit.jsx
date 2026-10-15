import { business, visit } from '../data'
import FloatingLogo from './FloatingLogo'

export default function Visit() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(visit.mapQuery)}&output=embed`

  return (
    <section id="visitanos" className="section section--soft has-floatlogo">
      <FloatingLogo className="floatlogo--right" />
      <div className="container visit">
        <div className="visit__info reveal">
          <p className="label">(07) Visítanos</p>
          <h2>Pasa por la tienda</h2>
          <p className="strong">{visit.address}</p>
          <ul className="list">
            {visit.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="visit__links">
            <a href={business.tiktok} className="link-line" target="_blank" rel="noreferrer">TikTok</a>
            {business.instagram && (
              <a href={business.instagram} className="link-line" target="_blank" rel="noreferrer">Instagram</a>
            )}
          </div>
        </div>

        <iframe
          className="map reveal"
          title="Ubicación de Quality Shop"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
