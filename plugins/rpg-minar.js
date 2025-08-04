const cooldowns = {}

let handler = async (m, { conn }) => {
  const name = await conn.getName(m.sender)
  const user = global.db.data.users[m.sender]
  const settings = global.db.data.settings[conn.user.jid] || {}
  const tiempoEspera = 5 * 60 // 5 minutos

  const recompensa = Math.floor(Math.random() * 5000) + 1500 // mínimo 1500

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `
✧ *Hola ${name}*, ya has minado recientemente.
⏱ Espera *${tiempoRestante}* para volver a entrar a la mina.
`, m)
  }

  user.exp += recompensa
  cooldowns[m.sender] = Date.now()

  const mensaje = `
⛏️ *¡Minería exitosa!*

➪ Ganaste: *+${recompensa} 💫 XP*
➪ Usuario: *${name}*

Sigue minando para mejorar tu experiencia.

© creado por *kenisawadev* ⚙️
`.trim()

  await m.react('⛏')
  await conn.reply(m.chat, mensaje, m)
}

handler.help = ['minar']
handler.tags = ['rpg']
handler.command = ['minar', 'miming', 'mine']
handler.register = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60)
  let segundosRestantes = segundos % 60
  return `${minutos}m ${segundosRestantes}s`
}