let handler = async (m, { conn, usedPrefix }) => {
  let settings = global.db.data.settings[conn.user.jid] || {}

  let botName = settings.botName || 'Waguri Ai'
  let deco = "✦"

  let plugins = Object.values(global.plugins).filter(v => v?.help && v.tags)
  let total = plugins.map(p => p.help).flat().length

  let categories = {}
  for (let p of plugins) {
    for (let tag of p.tags) {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...(p.help || []))
    }
  }

  let text = `╭━━〔 ${botName} | Comandos 〕━━╮
┃
┃ ${deco} 🔢 Total de comandos: *${total}*
┃ ${deco} 🧠 Usa *${usedPrefix}menu* para verlos.
┃
┃ ✦ Categorías de comandos:
┃`

  for (let cat in categories) {
    text += `\n┃ ${deco} ${capitalize(cat)}: *${categories[cat].length}*`
  }

  text += `\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯`

  await conn.sendMessage(m.chat, {
    text,
    footer: `${deco} ${botName} • Comandos Disponibles`,
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '📜 Ver Menú' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

handler.help = ['totalcmd']
handler.tags = ['info']
handler.command = /^totalcmd|cmdcount|comandos$/i

export default handler