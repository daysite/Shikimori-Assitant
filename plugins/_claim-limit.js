const rewards = {
  limit: 7500,
}

const cooldown = 86400000 // 24 horas

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let settings = global.db.data.settings[conn.user.jid] || {}
  let moneda = settings.moneda_rpg || 'Eris'

  if (user.role === 'Free user' && user.limit >= 7500) {
    return conn.reply(m.chat, `❀ 𝙻𝚘 𝚜𝚒𝚎𝚗𝚝𝚘...  
Los viajeros libres solo pueden recibir un máximo de *7500 ${moneda}* diarios.  
↺ 𝚅𝚞𝚎𝚕𝚟𝚎 𝚖𝚊ñ𝚊𝚗𝚊 𝚙𝚊𝚛𝚊 𝚖á𝚜 𝚛𝚎𝚌𝚘𝚖𝚙𝚎𝚗𝚜𝚊𝚜.`, m)
  }

  if (new Date - user.lastclaim < cooldown) {
    const timeLeft = ((user.lastclaim + cooldown) - new Date())
    const hours = Math.floor(timeLeft / 3600000)
    const minutes = Math.floor((timeLeft % 3600000) / 60000)
    const seconds = Math.floor((timeLeft % 60000) / 1000)
    return conn.reply(m.chat, `✿ 𝚈𝚊 𝚑𝚊𝚜 𝚌𝚕𝚊𝚖𝚊𝚍𝚘 𝚑𝚘𝚢  
ꕥ 𝙿𝚛𝚘́𝚡𝚒𝚖𝚊 𝚛𝚎𝚌𝚘𝚖𝚙𝚎𝚗𝚜𝚊 𝚎𝚗: *${hours}h ${minutes}m ${seconds}s*`, m)
  }

  let text = `✧ 𝚁𝚎𝚌𝚘𝚖𝚙𝚎𝚗𝚜𝚊 𝚍𝚎 𝚕𝚊 𝙲𝚊𝚗𝚝𝚒𝚗𝚊 𝚍𝚎 𝙰𝚛𝚟𝚊𝚗𝚍𝚘𝚛 ⛁\n\n`
  for (let reward of Object.keys(rewards)) {
    if (!(reward in user)) continue
    user[reward] += rewards[reward]
    text += `❀ *+${rewards[reward]}* ${moneda}\n`
  }

  conn.reply(m.chat, text.trim(), m)
  user.lastclaim = new Date * 1
}

handler.help = ['reclamar']
handler.tags = ['rpg']
handler.command = /^(reclamar)$/i
handler.cooldown = cooldown
handler.register = true

export default handler