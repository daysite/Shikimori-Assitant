import axios from 'axios'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const url = args[0]
  if (!url || !/youtube\.com|youtu\.be/.test(url)) {
    return m.reply(`✧ Debes proporcionar una URL válida de YouTube.\n\n✎ Ejemplo: ${usedPrefix + command} https://youtu.be/xxxxxx`)
  }

  try {
    const { data } = await axios({
      method: 'POST',
      url: 'https://docsbot.ai/api/tools/youtube-prompter',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        videoUrl: url,
        type: 'summary'
      }
    })

    const {
      title,
      short_title,
      summary,
      keyPoints,
      metadata
    } = data

    let res = `🌐 *Resumen del Video*\n`
    res += `✿ *${short_title || title}*\n`
    res += `📺 Canal: ${metadata?.channelName || "desconocido"}\n`
    res += `🕓 Duración: ${metadata?.duration || "?"}\n`
    res += `📅 Fecha: ${metadata?.date?.split("T")[0] || "?"}\n\n`
    res += `⛁ *Resumen:*\n> ${summary}\n\n`

    if (Array.isArray(keyPoints) && keyPoints.length > 0) {
      res += `✦ *Puntos Clave:*\n`
      for (let point of keyPoints) {
        res += `➪ *${point.point}*\n⤷ ${point.summary}\n\n`
      }
    }

    res += `🎞️ [Abrir video](${url})`

    await conn.sendMessage(m.chat, {
      image: { url: metadata?.thumbnail || "https://i.imgur.com/YObRBEc.jpg" },
      caption: res.trim()
    }, { quoted: m })

  } catch (err) {
    console.error('Error al resumir:', err.response?.data || err.message)
    m.reply(`❌ Error ${err.response?.status || ''}: No se pudo obtener el resumen.`)
  }
}

handler.help = ['ytresumen <url>']
handler.tags = ['ai', 'tools']
handler.command = /^yt(resumen|summary)$/i

export default handler