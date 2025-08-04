let handler = m => m

handler.before = m => {
  let user = global.db.data.users[m.sender]

  // Al regresar de AFK
  if (user.afk > -1) {
    let tiempo = clockString(new Date - user.afk)
    m.reply(`
❀ 𝚁𝚎𝚐𝚛𝚎𝚜𝚘 𝚍𝚎𝚕 𝚅𝚒𝚊𝚓𝚎 ⋆꙳༄
╰➤ 𝙷𝚊𝚋í𝚊𝚜 𝚎𝚜𝚝𝚊𝚍𝚘 𝙰𝙵𝙺 ${user.afkReason ? `\n✎ 𝚁𝚊𝚣𝚘́𝚗: _${user.afkReason}_` : ''}
✿ 𝚃𝚒𝚎𝚖𝚙𝚘: *${tiempo}*
`.trim())
    user.afk = -1
    user.afkReason = ''
  }

  // Detectar si alguien menciona a un usuario AFK
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let target = global.db.data.users[jid]
    if (!target || target.afk < 0) continue
    let tiempo = clockString(new Date - target.afk)
    m.reply(`
𖥔 𝙰𝚝𝚎𝚗𝚌𝚒𝚘́𝚗 𝚅𝚒𝚊𝚓𝚎𝚛𝚘 ⋆꙳༄  
✿ 𝚂𝚎 𝚎𝚗𝚌𝚞𝚎𝚗𝚝𝚛𝚊 𝙰𝙵𝙺 ${target.afkReason ? `\n✎ 𝙼𝚘𝚝𝚒𝚟𝚘: _${target.afkReason}_` : ''}
⌛ 𝚃𝚒𝚎𝚖𝚙𝚘 𝚊𝚕𝚎𝚓𝚊𝚍𝚘: *${tiempo}*
`.trim())
  }

  return true
}

export default handler

// Función para formatear tiempo
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}