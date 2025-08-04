import { AIFreeboxImage } from '../lib/aifreebox.js'

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('📺 Escribe una idea para generar un thumbnail.')
  const url = await AIFreeboxImage(text, '16:9', 'ai-youtube-thumbnail-generator')
  if (!url.startsWith('http')) return m.reply(url)
  await conn.sendFile(m.chat, url, 'thumb.jpg', `📺 *Thumbnail generado:*
🎬 ${text}`, m)
}

handler.command = /^thumb(nail)?$/i
handler.tags = ['ai', 'image']
handler.help = ['thumb <idea>']
export default handler