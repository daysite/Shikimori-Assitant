import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let { anon, anticall, antispam, antitroli, backup, jadibot, groupOnly, nsfw, statusupdate, autogetmsg, antivirus, publicjoin } = global.db.data.settings[conn.user.jid]

  const chats = Object.keys(await conn.chats)
  const groups = Object.keys(await conn.groupFetchAllParticipating())
  const block = await conn.fetchBlocklist()

  const uptime = clockString(process.uptime() * 1000)

  const tag = `@${m.sender.replace(/@.+/, '')}`
  const mentionedJid = [m.sender]

  const texto = `
⛁ 𝑬𝒔𝒕𝒂𝒅𝒐 𝒅𝒆 𝑾𝒂𝒈𝒖𝒓𝒊 𝑨𝒊 ⛁

✧ ʀᴜɴᴛɪᴍᴇ: ${uptime}
✧ ɢʀᴜᴘᴏꜱ: ${groups.length}
✧ ᴘᴠ'ꜱ: ${chats.length - groups.length}
✧ ᴜꜱᴜᴀʀɪᴏꜱ: ${Object.keys(global.db.data.users).length}
✧ ʙʟᴏQᴜᴇᴀᴅᴏꜱ: ${block?.length || 0}
✧ ᴄʜᴀᴛꜱ ʙᴀɴᴇᴀᴅᴏꜱ: ${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}
✧ ᴜꜱᴜᴀʀɪᴏꜱ ʙᴀɴᴇᴀᴅᴏꜱ: ${Object.entries(global.db.data.users).filter(user => user[1].banned).length}

⚿ 𝑴𝒐𝒅𝒐𝒔 𝒂𝒄𝒕𝒊𝒗𝒐𝒔 ⚿

✧ Chat Anónimo: ${anon ? '🟢' : '🔴'}
✧ Anti Llamadas: ${anticall ? '🟢' : '🔴'}
✧ Anti Spam: ${antispam ? '🟢' : '🔴'}
✧ Anti Bug Text: ${antitroli ? '🟢' : '🔴'}
✧ Auto Backup DB: ${backup ? '🟢' : '🔴'}
✧ Solo Grupos: ${groupOnly ? '🟢' : '🔴'}
✧ Ser Subbot: ${jadibot ? '🟢' : '🔴'}
✧ NSFW Mode: ${nsfw ? '🟢' : '🔴'}

❀ 𝑲𝒆𝒏𝒊𝒔𝒂𝒘𝒂𝑫𝒆𝒗 - 𝑾𝒂𝒈𝒖𝒓𝒊 𝑨𝒊 ❀
  `.trim()

  m.reply(texto)
}

handler.help = ['botstat']
handler.tags = ['info']
handler.command = /^botstat?$/i

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}