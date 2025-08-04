import { AIFreeboxImage } from '../lib/aifreebox.js'

const handler = async (m, { text, args, conn }) => {
  if (!text) return m.reply(`✿ *Inspírame...*  
Escribe una idea para que cree una ilustración mágica con inteligencia artificial.`)

  const imageUrl = await AIFreeboxImage(text, '16:9', 'ai-art-generator')

  await conn.sendFile(m.chat, imageUrl, 'aiimage.jpg', 
`⋆﹢🎨 𝙰𝚁𝚃𝙴 𝙰𝙸 𝙶𝙴𝙽𝙴𝚁𝙰𝙳𝙾 ⋆﹢
𖦹 *Tema:* _${text}_
𖧷 *Fuente:* AIFreeBox Generator
𓈃✧ 𝙷𝚎𝚌𝚑𝚘 𝚌𝚘𝚗 𝚌𝚊𝚛𝚒𝚗̃𝚘 𝚙𝚘𝚛 *Waguri Ai*
`, m)
}

handler.command = /^art$/i
handler.tags = ["ai"]
handler.help = ["art"]

export default handler