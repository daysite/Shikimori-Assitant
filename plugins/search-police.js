import fetch from 'node-fetch'

let handler = async (m, { text, conn, command }) => {
  if (!text) throw '✧ Ingresa un texto para buscar en *PoliceTube*\n\n✦ Ejemplo:\n.policesearch tiroteo policía'

  const res = await fetch(`https://api.policetube.co/search/home-related?keyword=${encodeURIComponent(text)}&limit=5`)
  const data = await res.json()

  if (!data.result || !data.result.vipe || data.result.vipe.length === 0)
    throw '✧ No se encontraron resultados.'

  let teks = `❀ *PoliceTube Resultados de búsqueda*\n\n`
  for (let vid of data.result.vipe) {
    teks += `⛁ *Título:* ${vid.title}\n⚿ *Vistas:* ${vid.views}\n✎ *Enlace:* https://policetube.co/video/${vid.video_id}\n──\n`
  }

  const thumb = 'https://files.catbox.moe/kpvz2y.png' // miniatura decorativa
  await conn.sendMessage(m.chat, {
    image: { url: thumb },
    caption: teks.trim(),
    mentions: []
  }, { quoted: m })
}
handler.help = ['policesearch <texto>']
handler.tags = ['internet']
handler.command = /^policesearch$/i
export default handler