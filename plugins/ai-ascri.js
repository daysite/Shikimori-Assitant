import axios from 'axios'
import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import path from 'path'

let handler = async (m, { args, text, conn }) => {
  if (!text) return m.reply(
`⟡ 𝚂𝚄𝙶𝙴𝚁𝙴𝙽𝙲𝙸𝙰 ⋆
✎ Por favor, escribe una palabra clave.

⤿ ᨒ Ejemplo: *.ascii naruto*`
  )

  try {
    const res = await axios.get('https://emojicombos.com/anime-text-art', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    const $ = cheerio.load(res.data)
    const results = []

    $('.combo-ctn').each((_, el) => {
      const tags = $(el).find('.keywords a').map((i, tag) => $(tag).text().toLowerCase()).get()
      const match = tags.some(tag => tag.includes(text.toLowerCase()))
      if (match) {
        const art = $(el).find('.emojis').text().trim()
        if (art.length > 10) results.push(art)
      }
    })

    if (results.length === 0)
      return m.reply(`✿ No encontré arte ASCII para: *${text}*`)

    const limited = results.slice(0, 10)
    const content = `𓆩⟡𓆪 𝙰𝚂𝙲𝙸𝙸 𝙰𝚁𝚃 𝚃𝙴𝙼𝙰: *${text}*\n\n` +
      limited.join('\n\n' + '─'.repeat(30) + '\n\n')

    const filePath = path.resolve('./tmp', `ascii-${Date.now()}.txt`)
    writeFileSync(filePath, content)

    await conn.sendMessage(m.chat, {
      document: { url: filePath },
      fileName: `ascii-${text}.txt`,
      mimetype: 'text/plain',
      caption: `☁︎ ᨳ Aquí tienes *${limited.length}* artes ASCII para: *${text}* ✿`
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply(`⚠︎︎ Lo siento... ocurrió un error inesperado.`)
  }
}

handler.help = ['ascii *<nombre>*']
handler.tags = ['ai']
handler.command = /^ascii$/i

export default handler