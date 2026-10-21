// Texto que aparece letra a letra, da esquerda para a direita, como se
// estivesse sendo escrito. Cada palavra fica num bloco inteiro para a quebra
// de linha ser a mesma do texto normal. Leitores de tela leem a frase inteira.
// Com `erasing`, faz o caminho inverso: apaga da última letra para a primeira.
export default function Typewriter({ text, as: Tag = 'p', className = '', onDone, erasing, onErased }) {
  let index = 0
  const total = text.replace(/ /g, '').length

  // a última letra avisa que a escrita terminou; a primeira, que apagou
  const onCharEnd = (i) => (e) => {
    if (e.animationName === 'type-in' && i === total - 1) onDone?.()
    if (e.animationName === 'type-out' && i === 0) onErased?.()
  }

  return (
    <Tag
      className={`typewriter${erasing ? ' is-erasing' : ''} ${className}`}
      style={{ '--total': total }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="typewriter__word">
              {[...word].map((char, c) => {
                const i = index++
                return (
                  <span
                    key={c}
                    className="typewriter__char"
                    style={{ '--c': i }}
                    onAnimationEnd={onCharEnd(i)}
                  >
                    {char}
                  </span>
                )
              })}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  )
}
