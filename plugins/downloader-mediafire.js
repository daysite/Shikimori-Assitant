import axios from 'axios'
import cheerio from 'cheerio'
import { lookup } from 'mime-types'
import { writeFileSync, unlinkSync } from 'fs'
import path from 'path'
import os from 'os'

async function mediafire(url) {
  if (!url.includes('www.mediafire.com')) throw new Error('⛔ URL no válida de MediaFire')

  const { data } = await axios.get('https://api.nekorinn.my.id/tools/rynn-stuff-v2', {
    params: {
      method: 'GET',
      url,
      accessKey: '3ebcf782818cfa0b7265086f112ae25c0954afec762aa05a2eac66580c7cb353'
    }
  })

  const $ = cheerio.load(data.result.response)
  const raw = $('div.dl-info')

  const filename = $('.dl-btn-label').attr('title') || raw.find('div.intro div.filename').text().trim()
  const ext = filename.split('.').pop()
  const mimetype = lookup(ext.toLowerCase()) || 'application/octet-stream'

  const filesize = raw.find('ul.details li:nth-child(1) span').text().trim()
  const uploaded = raw.find('ul.details li:nth-child(2) span').text().trim()
  const dl = $('a#downloadButton').attr('data-scrambled-url')
  if (!dl) throw new Error('Archivo no encontrado o no disponible')

  return {
    filename,
    filesize,
    mimetype,
    uploaded,
    download_url: atob(dl)
  }
}

function parseFileSize(sizeStr) {
  // Ej: "12.3 MB" => 12300000 bytes
  const match = sizeStr.match(/([\d.,]+)\s*(KB|MB|GB)/i)
  if (!match) return 0
  let [, size, unit] = match
  size = parseFloat(size.replace(',', '.'))
  switch (unit.toUpperCase()) {
    case 'KB': return size * 1024
    case 'MB': return size * 1024 * 1024
    case 'GB': return size * 1024 * 1024 * 1024
    default: return 0
  }
}

const handler = async (m, { args, conn, usedPrefix, command }) => {
  const url = args[0]
  if (!url) {
    return conn.reply(m.chat, `╭──❍ *✿ Descargador MediaFire* ❍──╮
│ ✧ ᝰ︙Ingresa el link válido de MediaFire.
│
│ Ejemplo:
│ ${usedPrefix + command} https://www.mediafire.com/file/xxxxxx/file
╰─────────────────────────────⬣`, m)
  }

  try {
    const info = await mediafire(url)

    let infoMsg = `╭─〔 *ꕥ Waguri MediaFire* 〕─⬣
│ ✿ *Nombre:* ${info.filename}
│ ✿ *Tamaño:* ${info.filesize}
│ ✿ *Subido:* ${info.uploaded}
│ ✿ *Tipo:* ${info.mimetype}
│
│ 🎐 *Link descarga directa:*
│ ${info.download_url}
╰──────────────⬣`

    const maxSize = 100 * 1024 * 1024 // 100MB
    const sizeBytes = parseFileSize(info.filesize)

    if (sizeBytes > maxSize) {
      // Archivo muy grande, solo info + link
      return conn.reply(m.chat, infoMsg + '\n\n⚠️ El archivo es demasiado grande para enviarlo por aquí.', m)
    }

    // Descarga el archivo temporalmente
    const tmpFile = path.join(os.tmpdir(), info.filename)

    const response = await axios({
      url: info.download_url,
      method: 'GET',
      responseType: 'arraybuffer'
    })

    writeFileSync(tmpFile, response.data)

    // Envía el archivo como documento
    await conn.sendMessage(m.chat, {
      document: { url: tmpFile },
      mimetype: info.mimetype,
      fileName: info.filename,
      caption: infoMsg
    }, { quoted: m })

    // Borra el archivo temporal
    unlinkSync(tmpFile)

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, `❌ Error: ${err.message}`, m)
  }
}

handler.command = ['mediafire', 'mf']
handler.help = ['mediafire <link>']
handler.tags = ['downloader']
handler.premium = false
handler.register = false

export default handler