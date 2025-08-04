import fetch from 'node-fetch'

let handler = async (m, { conn, command, usedPrefix }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const url = `https://api.waifu.pics/sfw/waifu`

  const response = await fetch(url)
  const data = await response.json()

  if (!data?.url) return conn.reply(m.chat, '❌ No se pudo obtener fanart.', m)

  await conn.sendMessage(m.chat, {
    image: { url: data.url },
    caption: `⋆⛧⋆ 𝙵𝙰𝙽𝙰𝚁𝚃 ⋆⛧⋆

✦ 𝙰𝚛𝚝𝚎 𝚍𝚒𝚐𝚒𝚝𝚊𝚕 𝚍𝚎 𝚋𝚎𝚕𝚕𝚎𝚣𝚊 𝚎𝚝𝚎́𝚛𝚎𝚊 𝚢 𝚜𝚘𝚏𝚝 𝚎𝚜𝚝𝚒𝚕𝚘 𝚆𝚊𝚐𝚞𝚛𝚒 ♡

✿ 𝙷𝚊𝚣 𝚌𝚕𝚒𝚌 𝚊𝚋𝚊𝚓𝚘 𝚙𝚊𝚛𝚊 𝚟𝚎𝚛 𝚖𝚊́𝚜:`.trim(),
    footer: 'Waguri Ai — 𝖿𝖺𝗇𝖺𝗋𝗍 ♡',
    buttons: [
      { buttonId: `${usedPrefix}fanart`, buttonText: { displayText: '⛧ Otro Fanart ⛧' }, type: 1 },
      { buttonId: `${usedPrefix}cosplay`, buttonText: { displayText: '❀ Cosplay' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m })
}

handler.command = /^(fanart)$/i
handler.tags = ['anime']
handler.help = ['fanart']
handler.limit = false
handler.premium = false
handler.register = true

export default handler