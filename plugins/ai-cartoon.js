import { AIFreeboxImage } from '../lib/aifreebox.js'

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('🎞️ Escribe una escena para convertirla en caricatura.')
  const url = await AIFreeboxImage(text, '16:9', 'ai-old-cartoon-characters-generator')
  if (!url.startsWith('http')) return m.reply(url)
  await conn.sendFile(m.chat, url, 'cartoon.jpg', `🎞️ *Caricatura estilo retro generada:*
🖍️ ${text}`, m)
}

handler.command = /^cartoon$/i
handler.tags = ['ai', 'image']
handler.help = ['cartoon <escena>']
export default handler