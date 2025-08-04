export async function before(m, { conn }) {
  if (!m.sender || m.isBot || !m.isGroup) return

  const user = global.db.data.users[m.sender]
  const settings = global.db.data.settings[conn.user.jid] || {}
  const canalCumple = '120363421894255558@newsletter' // ← cambia por tu canal real

  if (!user.birthday || !conn.user.jid) return

  let hoy = new Date()
  let hoyStr = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}`

  if (user.birthday === hoyStr && user.lastBirthdayClaim !== hoyStr) {
    user.lastBirthdayClaim = hoyStr

    let xpReward = 50000
    let coinReward = 50000

    user.exp += xpReward
    user.limit += coinReward

    let username = await conn.getName(m.sender)
    let mensajePrivado = `🎉 *¡Feliz Cumpleaños, ${username}!* 🎂\n\nHas recibido una recompensa especial:\n➜ +${xpReward} 💫 XP\n➜ +${coinReward} ${settings.moneda_rpg}\n\n_— Con cariño, kenisawadev 🩷_`

    // 🎁 Enviar recompensa al privado
    await conn.sendMessage(m.sender, { text: mensajePrivado }, { quoted: m })

    // 🎊 Anunciar públicamente en el canal
    let anuncio = `🎈 *¡Hoy está de cumpleaños!* 🎉\n\nFelicitamos con cariño a @${m.sender.split('@')[0]} 🎂\n\n— ¡Pásala increíble! 🥳\n\n© kenisawadev`
    await conn.sendMessage(canalCumple, { text: anuncio, mentions: [m.sender] })
  }
}