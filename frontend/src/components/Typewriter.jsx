// Texto que aparece letra a letra, da esquerda para a direita, como se
// estivesse sendo escrito. Cada palavra fica num bloco inteiro para a quebra
// de linha ser a mesma do texto normal. Leitores de tela leem a frase inteira.
export default function Typewriter({ text, as: Tag = 'p', className = '', onDone }) {
  let index = 0
  const total = text.replace(/ /g, '').length

  return (
    <Tag className={`typewriter ${className}`}>
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
                    // a última letra avisa que a escrita terminou
                    onAnimationEnd={i === total - 1 ? onDone : undefined}
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
