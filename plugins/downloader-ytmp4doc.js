import fetch from 'node-fetch'

const extractVideoID = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw m.reply(`✧ Ejemplo de uso:\n${usedPrefix + command} https://youtube.com/watch?v=dQw4w9WgXcQ`)

  await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } })

  const videoUrl = text.trim()
  const videoID = extractVideoID(videoUrl)

  if (!videoID) throw m.reply('✧ Ingresa un enlace válido de YouTube.')

  try {
    const api = `https://api.zenkey.my.id/api/download/ytmp4?url=${videoUrl}&apikey=zenkey`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.result?.content?.length || !json.result.content[0].mediaLink)
      throw new Error('No se pudo obtener el video.')

    const { title, mediaLink } = json.result.content[0]

    const caption = `📥 *Descarga exitosa*\n🎬 Título: ${title}\n📤 Enviado como documento`

    await conn.sendMessage(m.chat, {
      document: { url: mediaLink },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    throw m.reply(`✖️ Error al descargar el video:\n${err.message || err}`)
  }
}

handler.help = ['ytmp4doc <enlace>']
handler.tags = ['downloader']
handler.command = /^yt(mp4doc|vdoc)$/i
handler.register = true

export default handler