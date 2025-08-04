import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
  if (!args[0]) throw m.reply(`*✧ Seleccióna una opción:*
awoo
megumin
neko
shinobu
waifu`)
  let res = await fetch(`https://api.waifu.pics/sfw/${text}`)
  if (!res.ok) throw await res.text()
  let json = await res.json()
  if (!json.url) throw m.reply('Error!')
  conn.sendFile(m.chat, json.url, '', settings.wm, m)
}

handler.tags = ['anime']
handler.help = ['sfw']
handler.command = /^(sfw)$/i
handler.premium = false
handler.limit = false

export default handler