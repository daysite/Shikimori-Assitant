import fetch from 'node-fetch'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

async function catboxUpload(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' }
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime })

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  if (!res.ok) throw new Error('❌ Error al subir la imagen a Catbox.')
  return await res.text()
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) {
    return m.reply(`✧ Responde a una imagen o envía una imagen para convertir al estilo *SDM Tinggi*\n\n📌 Ejemplo: ${usedPrefix + command}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

  try {
    const imgBuffer = await q.download()
    const imageUrl = await catboxUpload(imgBuffer)

    const api = `https://zenzxz.dpdns.org/maker/tosdmtinggi?url=${encodeURIComponent(imageUrl)}`
    const res = await fetch(api)
    const finalBuffer = await res.buffer()

    await conn.sendFile(m.chat, finalBuffer, 'sdmtinggi.jpg', '✨ Resultado estilo *SDM Tinggi*', m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar la imagen estilo SDM Tinggi.')
  }
}

handler.command = /^sdmtinggi$/i
handler.help = ['sdmtinggi']
handler.tags = ['maker']

export default handler