import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭─❖『 🎧 *REMIX MUSIC* 🎧 』❖─╮
│ 🧬 *Debes escribir el nombre de una canción!*
│ 
│ ✧ Ejemplo:
│ ➥ ${usedPrefix + command} calm down
╰────────────────────╯`)
  }

  const remixOptions = [
    `${text} remix`,
    `${text} sped up`,
    `${text} slowed reverb`,
    `${text} phonk remix`,
    `${text} nightcore`,
    `${text} bass boosted`,
    `${text} reverb version`
  ]

  const picked = remixOptions.sort(() => 0.5 - Math.random()).slice(0, 2)
  const results = []

  for (const query of picked) {
    try {
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      const html = await (await fetch(url)).text()

      const videoId = html.match(/"videoId":"(.*?)"/)?.[1]
      const title = html.match(/"title":{"runs":\[\{"text":"(.*?)"\}/)?.[1]

      if (videoId && title) {
        results.push({ title, videoId })
      }
    } catch (e) {
      console.error(`❌ Error al buscar: ${query}`, e)
    }
  }

  if (!results.length) return m.reply('🚫 No se encontraron remixes para esa canción.')

  const listSections = [
    {
      title: "🎧 𝑬𝒍𝒊𝒈𝒆 𝒖𝒏 𝑹𝒆𝒎𝒊𝒙",
      rows: results.map(r => ({
        title: `🎶 ${r.title}`,
        rowId: `${usedPrefix}ytmp3 https://youtu.be/${r.videoId}`,
        description: '✦ Pulsa para descargar ♪'
      }))
    }
  ]

  const listMessage = {
    text: `╭─❖『 *💿 𝑹𝑬𝑴𝑰𝑿 𝑺𝑬𝑳𝑬𝑪𝑻𝑶𝑹* 』❖─╮
│ 🎼 *Original:* ${text}
│ 🎧 *Opciones:* ${results.length} remixes
╰────────────────────╯`,
    footer: 'Waguri Ai ♪ Remixes y Estética Oscura',
    title: '🎵 𝑹𝒆𝒄𝒐𝒎𝒆𝒏𝒅𝒂𝒅𝒐 𝒑𝒐𝒓 𝑾𝒂𝒈𝒖𝒓𝒊 𝑨𝒊',
    buttonText: '🎧 Elegir remix',
    sections: listSections
  }

  await conn.sendMessage(m.chat, listMessage, { quoted: m })
}

handler.help = ['remix']
handler.tags = ['music']
handler.command = /^remix$/i

export default handler