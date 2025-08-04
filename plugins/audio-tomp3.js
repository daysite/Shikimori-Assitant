import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  let chat = global.db.data.chats[m.chat]
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!/video|audio/.test(mime))
    throw m.reply(`✧ Responde a un *video* o *nota de voz* para convertir en audio\n\nEjemplo: *${usedPrefix + command}*`)

  let media = await q.download?.()
  if (!media) throw m.reply('✧ No se pudo descargar el archivo.')

  let audio = await toAudio(media, 'mp4')
  if (!audio.data) throw m.reply('✧ Error al convertir el archivo.')

  await conn.sendFile(
    m.chat,
    audio.data,
    'audio.mp3',
    `✧ Conversión completa.\n_Archivo en formato MP3 listo para reproducir._`,
    m,
    null,
    {
      mimetype: 'audio/mp4',
      asDocument: chat.useDocument
    }
  )
}

handler.help = ['tomp3']
handler.tags = ['audio']
handler.command = /^to(mp3|audio)?$/i
handler.register = true

export default handler