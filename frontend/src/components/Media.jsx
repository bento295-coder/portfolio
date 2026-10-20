// Imagem com proporção reservada ('16:9' horizontal | '3:4' vertical), para a página não pular
// enquanto carrega. Sem src, mostra o placeholder.
export default function Media({ media, alt = '', className = '', eager = false }) {
  const [w, h] = (media.ratio ?? '16:9').split(':')

  return (
    <div className={`media ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      {media.src && <img src={media.src} alt={alt} loading={eager ? 'eager' : 'lazy'} />}
    </div>
  )
}
