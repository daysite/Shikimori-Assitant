import axios from 'axios'
import yts from 'yt-search'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✧ Ejemplo: *${usedPrefix + command} Joji Glimpse of Us*`)

  await conn.sendMessage(m.chat, { react: { text: '📽️', key: m.key } })

  let search = await yts(text)
  let video = search.videos[0]
  if (!video) return m.reply('❌ No se encontró el video.')

  const quality = '360' // ← más compatible
  const url = encodeURIComponent(video.url)
  const dlApi = `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${quality}&iframe_source=https://allinonetools.com/&url=${url}`

  let session
  try {
    let res = await axios.get(dlApi, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 30000
    })
    session = res.data
  } catch (e) {
    return m.reply('❌ No se pudo iniciar la descarga. El video podría estar restringido.')
  }

  if (!session?.progress_url) return m.reply('⚠️ La API no devolvió un enlace válido de descarga.')

  let attempts = 0, videoData
  while (attempts < 20) {
    await new Promise(r => setTimeout(r, 3000))
    try {
      let res = await axios.get(session.progress_url)
      if (res.data.download_url) {
        videoData = res.data
        break
      }
    } catch (e) {
      // Reintentar
    }
    attempts++
  }

  if (!videoData?.download_url) return m.reply('❌ La descarga tardó demasiado. Intenta más tarde.')

  await conn.sendMessage(m.chat, {
    video: { url: videoData.download_url },
    mimetype: 'video/mp4',
    fileName: videoData.title || `${video.title}.mp4`
  }, { quoted: m })

  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['ytmp4 <texto o link>']
handler.tags = ['downloader']
handler.command = /^ytmp4$/i

export default handler