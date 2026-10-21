// Imagem ou vídeo de projeto.
//  - Com `ratio` ('16:9' | '3:4'): proporção fixa, preenchendo o espaço (corta
//    o que sobrar). Usado nas thumbs.
//  - Sem `ratio`: proporção natural, mostrada inteira. Usado na galeria; a
//    largura/altura vêm do build (media-size-plugin) para reservar o espaço.
// Vídeos (.mp4, .webm…) tocam sozinhos, em loop e sem som, como um GIF.
const VIDEO = /\.(mp4|webm|mov|m4v)$/i
export const isVideo = (src) => VIDEO.test(src ?? '')

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Media({ media, alt = '', className = '', eager = false, ...rest }) {
  const { src, ratio, width, height } = media

  let aspect
  if (ratio) aspect = ratio.replace(':', ' / ')
  else if (width && height) aspect = `${width} / ${height}`
  else if (!src) aspect = '16 / 9' // placeholder sem arquivo

  const fit = ratio ? 'cover' : 'natural'

  return (
    <div
      className={`media media--${fit} ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
      {...rest}
    >
      {src &&
        (isVideo(src) ? (
          <video
            src={src}
            autoPlay={!reducedMotion()}
            muted
            loop
            playsInline
            preload={eager ? 'auto' : 'metadata'}
            aria-label={alt || undefined}
          />
        ) : (
          <img src={src} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} />
        ))}
    </div>
  )
}
