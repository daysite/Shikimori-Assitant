import { areJidsSameUser } from '@adiwajshing/baileys'

const handler = async (m, { conn, text, participants, args, command }) => {
  const groupMembers = participants.map(u => u.id)
  const target = isNaN(text) ? groupMembers.length : parseInt(text)
  let total = 0
  let inactivos = []

  for (let i = 0; i < target; i++) {
    const user = participants.find(u => u.id === groupMembers[i]) || {}
    const userData = global.db.data.users[groupMembers[i]]

    const isInactive = (!userData || userData.chat === 0)
    const isNotAdmin = !user.isAdmin && !user.isSuperAdmin
    const notWhitelisted = userData?.whitelist === false || !userData

    if (isInactive && isNotAdmin && notWhitelisted) {
      total++
      inactivos.push(groupMembers[i])
    }
  }

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  switch (command) {
    case 'fantasmas':
      if (total === 0) {
        return conn.reply(m.chat, `
☁︎ ︙Este grupo parece bastante activo.

⛁ ︙No se detectaron miembros fantasmas o inactivos.
        `.trim(), m)
      }

      return conn.reply(m.chat, `
❀ 𝐈𝐍𝐅𝐎𝐑𝐌𝐄 𝐃𝐄 𝐈𝐍𝐀𝐂𝐓𝐈𝐕𝐎𝐒 ✎

Se encontraron *${total}* miembros aparentemente inactivos:

${inactivos.map(v => '⤷ @' + v.replace(/@.+/, '')).join('\n')}

⚠︎ ︰El análisis se basa en la actividad desde que el bot fue activado.
        `.trim(), m, { mentions: inactivos })

    case 'kickfantasmas':
      if (total === 0) {
        return conn.reply(m.chat, `
☁︎ ︙Este grupo no contiene fantasmas.

⛁ ︙Todos los miembros han interactuado al menos una vez.
        `.trim(), m)
      }

      await conn.reply(m.chat, `
⚠︎ 𝐄𝐋𝐈𝐌𝐈𝐍𝐀𝐂𝐈Ó𝐍 𝐃𝐄 𝐅𝐀𝐍𝐓𝐀𝐒𝐌𝐀𝐒 ✎

⛁ Miembros inactivos detectados:
${inactivos.map(v => '⤷ @' + v.replace(/@.+/, '')).join('\n')}

✿ Nota: Serán eliminados uno por uno con un intervalo de *10 segundos*.

𐚁 Esta función evita eliminar admins o usuarios con permisos especiales.
        `.trim(), m, { mentions: inactivos })

      let chat = global.db.data.chats[m.chat]
      chat.welcome = false

      try {
        for (let user of inactivos) {
          if (
            user.endsWith('@s.whatsapp.net') &&
            !(participants.find(p => areJidsSameUser(p.id, user))?.admin)
          ) {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            await delay(10_000)
          }
        }
      } finally {
        chat.welcome = true
      }
      break
  }
}

handler.tags = ['group']
handler.command = ['fantasmas', 'kickfantasmas']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler