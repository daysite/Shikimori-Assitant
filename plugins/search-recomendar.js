import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const genres = {
    '🎸 Rock': ['rock clásico', 'rock alternativo', 'rock en español'],
    '🎧 Lo-fi': ['lofi hip hop', 'chill lofi', 'lofi beats'],
    '🎹 Electrónica': ['electronic music', 'synthwave', 'edm'],
    '🎤 Pop': ['pop latino', 'pop internacional', 'top pop'],
    '🔥 Funk Brasileiro': ['funk brasileiro', 'funk carioca', 'baile funk'],
    '🎵 Funk': ['funk americano', 'funk soul', 'old school funk'],
    '📱 TikTok Trends': ['tiktok viral 2024', 'tiktok trending songs', 'música viral tiktok'],
    '🧃 Phonk': ['phonk music', 'phonk mix', 'phonk 2024'],
    '🌴 Phonk Brasileiro': ['phonk brasileiro', 'brazilian phonk', 'phonk funk brasil'],
    '🎶 Aleatorio': ['music', 'random music', 'hit songs']
  }

  const sections = [{
    title: "🌐 Selecciona un género para recomendarte música:",
    rows: Object.keys(genres).map(k => ({
      title: k,
      description: `Sugerencias de ${k}`,
      rowId: `${usedPrefix + command} ${k.replace(/[^a-zA-Z]/g, '').toLowerCase()}`
    }))
  }]

  const genreArg = (args[0] || '').toLowerCase()
  const foundGenre = Object.keys(genres).find(g =>
    g.toLowerCase().replace(/[^a-z]/g, '') === genreArg
  )

  if (!genreArg || !foundGenre) {
    return await conn.sendMessage(m.chat, {
      text: '🎵 Elige un género musical:',
      footer: 'Waguri Ai ♪ Recomendaciones Musicales',
      buttonText: '🎶 Elegir género',
      sections
    }, { quoted: m })
  }

  const queryOptions = genres[foundGenre]
  const query = queryOptions[Math.floor(Math.random() * queryOptions.length)]
  const searchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  const html = await (await fetch(searchURL)).text()
  const videoIds = [...html.matchAll(/"videoId":"(.*?)"/g)].map(v => v[1])
  const titles = [...html.matchAll(/"title":{"runs":\[\{"text":"(.*?)"\}\]/g)].map(t => t[1])

  if (!videoIds.length || !titles.length) return m.reply('❌ No se encontraron resultados, intenta otro género.')

  const pick = Math.floor(Math.random() * Math.min(videoIds.length, titles.length))
  const videoUrl = `https://youtu.be/${videoIds[pick]}`
  const title = titles[pick]

  const message = `
*🎵 Recomendación musical (${foundGenre}):*

• 🎼 *${title}*
• 🔗 ${videoUrl}
`.trim()

  await conn.sendMessage(m.chat, {
    text: message,
    footer: 'Waguri Ai ♪ Música al instante',
    buttons: [
      { buttonId: `${usedPrefix}ytmp3 ${videoUrl}`, buttonText: { displayText: '▶️ Reproducir' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['recomienda', 'recsong']
handler.tags = ['music']
handler.command = /^recomienda|recsong$/i

export default handler