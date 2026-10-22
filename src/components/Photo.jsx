import { useState } from 'react'
import { useLogoCutoutUrl } from '../cutout'

// Recuadro negro con el oso de la marca, para cuando todavía no existe la foto
function Placeholder({ className, alt }) {
  const bear = useLogoCutoutUrl()

  return (
    <div className={`ph ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
      {bear && <img src={bear} alt="" />}
    </div>
  )
}

// Foto que, si todavía no existe el archivo, muestra el recuadro de la marca
export default function Photo({ src, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) return <Placeholder className={className} alt={alt} />

  return (
    <img
      className={`photo ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
