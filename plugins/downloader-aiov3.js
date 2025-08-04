import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args[0]
  if (!url) return m.reply(`✧ Ejemplo:\n${usedPrefix + command} https://vm.tiktok.com/ZMSsnsATh/`)

  await conn.sendMessage(m.chat, { react: { text: '🔄', key: m.key }})

  try {
    const res = await fetch(`https://zenzxz.dpdns.org/downloader/aio?url=${encodeURIComponent(url)}`)
    const json = await res.json()

    if (!json.status || !json.result?.medias) {
      return m.reply('❌ No se pudo descargar este contenido. Verifica el link.')
    }

    const { title, author, source, medias } = json.result
    const video = medias.find(m => m.type === 'video' && m.quality.includes('no_watermark'))
    const audio = medias.find(m => m.type === 'audio')

    const platformEmoji = {
      tiktok: '🎵',
      youtube: '▶️',
      facebook: '📘',
      instagram: '📸',
      twitter: '🐦',
      unknown: '🌐'
    }

    const platform = platformEmoji[source] || platformEmoji.unknown

    const caption = `
╭─〔 ${platform} Descargador Automático 〕─⬣
│ 📥 *Plataforma:* ${source.toUpperCase()}
│ 📎 *Link:* ${url}
│ 🎞️ *Título:* ${title || 'Desconocido'}
│ 👤 *Autor:* ${author || 'No disponible'}
╰────────────⬣
✨ _Keis Ai al servicio del multiverso_`

    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video.url },
        mimetype: 'video/mp4',
        caption
      }, { quoted: m })
    }

    if (audio) {
      await conn.sendMessage(m.chat, {
        audio: { url: audio.url },
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `${title || 'audio'}.mp3`
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (err) {
    console.error(err)
    return m.reply('❌ Hubo un error al procesar el contenido. Vuelve a intentar más tarde.')
  }
}

handler.command = /^aiov3$/i
handler.help = ['aiov3 <link>']
handler.tags = ['downloader']

export default handler