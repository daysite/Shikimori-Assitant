import { createHash } from 'crypto'
const { proto, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default;

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix }) {
  let sn = createHash('md5').update(m.sender).digest('hex')

m.reply(`${sn}`)
}

handler.help = ['versn']
handler.tags = ['xp']
handler.command = /^(versn)$/i
handler.register = true
export default handler