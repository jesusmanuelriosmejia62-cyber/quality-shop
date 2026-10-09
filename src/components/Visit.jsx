import { visit } from '../data'

export default function Visit() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(visit.mapQuery)}&output=embed`

  return (
    <section id="visitanos" className="section section--soft">
      <div className="container grid grid--2">
        <div>
          <h2>Visítanos</h2>
          <p className="strong">{visit.address}</p>
          <ul className="list">
            {visit.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <iframe
          className="map"
          title="Ubicación de Quality Shop"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}