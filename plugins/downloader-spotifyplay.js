import axios from 'axios'

let handler = async (m, { conn, text, command }) => {
  if (!text) {
    return m.reply(`¡Introduce el título de la canción!\nEjemplo: .${command} Joji - Ew`)
  }

  try {
    await m.reply('🔎 Buscando la canción en Spotify...')

    const search = await axios.get(`https://fastrestapis.fasturl.cloud/music/spotify?name=${encodeURIComponent(text)}`)
    const results = search.data.result
    if (!results || !results.length) throw m.reply('❌ Canción no encontrada.');

    const result = results.find(v => v.title.toLowerCase().includes(text.toLowerCase())) || results[0]

    const down = await axios.get(`https://velyn.biz.id/api/downloader/spotifydl?url=${encodeURIComponent(result.url)}`)
    const download = down.data.data
    if (!download?.download) throw m.reply('❌ Gagal mengunduh lagu.');

    await conn.sendMessage(m.chat, {
  audio: { url: download.download },
  mimetype: 'audio/mpeg',
  fileName: `${download.title} - ${download.artist}.mp3`,
}, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(typeof e === 'string' ? e : '❌ Se produjo un error al procesar la canción.')
  }
}

handler.help = ['splay', 'spotifyplay'].map(v => v + ' *<titulo>*')
handler.tags = ['downloader']
handler.command = /^s(play|potifyplay)$/i

export default handler