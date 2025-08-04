let handler = async (m, { conn }) => {
  let start = performance.now()
  let end = performance.now()
  m.reply(`⚙️ 𝙇𝙖𝙩𝙚𝙣𝙘𝙞𝙖: *${(end - start).toFixed(2)} ms*`)
}
handler.command = ['p']
handler.tags = ['info']
handler.help = ['p']
export default handler