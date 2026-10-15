import { money } from '../utils'

export default function ProductCard({ p }) {
  return (
    <a href={`#/prenda/${p.id}`} className="product">
      <div className="product__img">
        <img className="photo" src={p.photo} alt={p.name} loading="lazy" />
        {p.tag && <span className="product__tag">{p.tag}</span>}
      </div>
      <div className="product__body">
        <p className="product__cat">{p.cats[0]}</p>
        <h3>{p.name}</h3>
        <p className="product__price">{p.price ? money.format(p.price) : 'Consultar precio'}</p>
        <p className="product__sizes">{p.sizes.join(' · ')}</p>
      </div>
    </a>
  )
}
