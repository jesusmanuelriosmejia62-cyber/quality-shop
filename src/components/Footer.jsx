import { business, logo, whatsappLink } from '../data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={logo} alt="" width="48" height="48" />
          <div>
            <strong>{business.name}</strong>
            <p>{business.city}</p>
          </div>
        </div>
        <div className="footer__links">
          <a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={business.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          {business.instagram && (
            <a href={business.instagram} target="_blank" rel="noreferrer">Instagram</a>
          )}
          {business.facebook && (
            <a href={business.facebook} target="_blank" rel="noreferrer">Facebook</a>
          )}
        </div>
      </div>
      <p className="footer__copy">
        © {new Date().getFullYear()} {business.name}. Todos los derechos reservados.
      </p>
    </footer>
  )
}