let handler = async (m) => {
  const n = Math.floor(Math.random() * 6) + 1
  m.reply(`🎲 𝙏𝙧𝙤𝙡𝙡𝙤 𝙙𝙖𝙙𝙤... *${n}* 🎲`)
}
handler.command = ['dado', 'dados']
handler.tags = ['fun']
handler.help = ['dados']
export default handler