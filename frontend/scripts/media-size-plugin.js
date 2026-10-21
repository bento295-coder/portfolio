// Galeria em proporção natural: ao carregar cada projeto (src/content/projects/*.json),
// lê largura e altura de cada imagem em public/ e anota no dado. Assim a página
// reserva o espaço certo antes da imagem chegar (não "pula") e mostra a imagem
// inteira, sem corte. Vídeos não são lidos aqui: tomam a proporção ao carregar.
import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'

const PROJECT_JSON = /[\\/]src[\\/]content[\\/]projects[\\/][^\\/]+\.json$/
const VIDEO = /\.(mp4|webm|mov|m4v)$/i

export default function mediaSizePlugin() {
  let publicDir

  return {
    name: 'bento-media-size',
    // antes do plugin de JSON do Vite, para receber o JSON cru
    enforce: 'pre',

    configResolved(config) {
      publicDir = config.publicDir
    },

    transform(code, id) {
      if (!PROJECT_JSON.test(id.split('?')[0])) return null
      const data = JSON.parse(code)

      data.images = (data.images ?? []).map((img) => {
        if (!img.src || VIDEO.test(img.src)) return img
        try {
          const { width, height } = imageSize(fs.readFileSync(path.join(publicDir, img.src)))
          return { ...img, width, height }
        } catch {
          return img // arquivo não encontrado: a imagem toma a proporção ao carregar
        }
      })

      return { code: JSON.stringify(data), map: null }
    },
  }
}
