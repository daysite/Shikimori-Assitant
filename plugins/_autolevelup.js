import { xpRange, canLevelUp } from '../lib/levelling.js'
import fetch from 'node-fetch'

let handler = m => m

handler.all = async function (m) {
  let user = global.db.data.users[m.sender]
  if (!user.autolevelup) return !0

  let exp = user.exp
  let { min, xp, max } = xpRange(user.level, global.multiplier)
  let before = user.level
  let username = conn.getName(m.sender)
  let tag = `@${m.sender.split('@')[0]}`

  // Sube de nivel si aplica
  while (canLevelUp(user.level, user.exp, global.multiplier)) {
    user.level++
  }

  if (before !== user.level) {
    try {
      let profilePic = await conn.profilePictureUrl(m.sender, 'image').catch(() => './src/avatar_contact.png')
      let logo = await (await fetch(thumblvlup.getRandom())).buffer()
      user.role = global.db.data.users[m.sender].role

      await conn.sendFile(m.chat, logo, 'levelup.jpg', 
`╭─❍ *⛁ Nivel Subido*
│⛁ *Nombre:* ${tag}
│⛁ *Rol:* ${user.role}
│⛁ *XP:* ${exp} xp
╰⛁ *Nivel:* ${before} ➠ ${user.level}`, m, { mentions: [m.sender] })

    } catch (e) {
      console.error('Error enviando mensaje de nivel:', e)
    }
  }
}

export default handler