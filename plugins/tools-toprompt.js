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
    return m.reply(`✧ Responde o envía una imagen para analizarla con AI\n\n📌 Uso: ${usedPrefix + command}`)
  }

  await conn.sendMessage(m.chat, { react: { text: '🧠', key: m.key } })

  try {
    const imgBuffer = await q.download()
    const imageUrl = await catboxUpload(imgBuffer)

    const api = `https://zenzxz.dpdns.org/tools/toprompt?url=${encodeURIComponent(imageUrl)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.status) throw new Error('⚠️ No se pudo generar el prompt.')

    const prompt = json.result || 'No se generó ningún prompt útil.'

    await m.reply(`📝 *Prompt generado:*\n\n${prompt}`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Hubo un error al generar el prompt.')
  }
}

handler.command = /^toprompt$/i
handler.help = ['toprompt']
handler.tags = ['tools']

export default handler