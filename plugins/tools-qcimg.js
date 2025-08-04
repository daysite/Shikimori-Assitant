let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  const [name, ...captionArr] = text.split('|').map(v => v.trim())
  const caption = captionArr.join(' ')
  
  if (!name || !caption)
    return m.reply(`╭━━⊰ 🌟 *Waguri Quote Maker* 🌟 ⊱━━╮
┃
┃ ✧ *Uso:* ${usedPrefix + command} <nombre> | <mensaje>
┃ ✧ *Ejemplo:* ${usedPrefix + command} Keis Dev | Waguri Ai está de vuelta 💥
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯`)

  const pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/album/fakepp.jpg')
  const bg = 'https://files.catbox.moe/2tk9n3.jpg'
  const api = `https://velyn.mom/api/maker/qcimg?bg=${encodeURIComponent(bg)}&caption=${encodeURIComponent(caption)}&name=${encodeURIComponent(name)}&ppurl=${encodeURIComponent(pp)}`

  try {
    await conn.sendFile(m.chat, api, 'quote.jpg', `🖋️ ${name}\n💬 "${caption}"\n\n✦ Generado por *Waguri Ai*`, m)
  } catch (e) {
    await m.reply('❌ Hubo un error al generar la imagen.')
  }
}

handler.help = ['quoteimg *<nombre> | <mensaje>*']
handler.tags = ['tools', 'maker']
handler.command = /^quoteimg|qcimg|cita$/i
handler.register = true

export default handler