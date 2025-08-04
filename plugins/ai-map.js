import { AIFreeboxImage } from '../lib/aifreebox.js'

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('🗺️ Escribe una idea para generar un mapa.')
  const url = await AIFreeboxImage(text, '16:9', 'ai-fantasy-map-creator')
  if (!url.startsWith('http')) return m.reply(url)
  await conn.sendFile(m.chat, url, 'map.jpg', `🗺️ *Mapa Fantástico generado:*
🌍 ${text}`, m)
}

handler.command = /^map$/i
handler.tags = ['ai', 'image']
handler.help = ['map <idea>']
export default handler