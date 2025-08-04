let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = await conn.getName(senderId)
  const settings = global.db.data.settings[conn.user.jid] || {}

  const moneda = settings.moneda_rpg || '💰'
  const tiempoEspera = 5 * 60 // en segundos

  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempoEspera * 1000 - Date.now()) / 1000))
    return m.reply(`✧ *Ya cometiste un crimen recientemente.*\n⏱ Espera *${tiempoRestante}* antes de volver a intentarlo.`)
  }

  cooldowns[senderId] = Date.now()

  let senderLimit = users[senderId].limit || 0
  let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]

  // Evitar que el usuario se robe a sí mismo
  while (randomUserId === senderId) {
    randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  }

  let randomUserLimit = users[randomUserId].limit || 0
  let minAmount = 15
  let maxAmount = 50

  let amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount
  let resultado = Math.floor(Math.random() * 3)

  switch (resultado) {
    case 0: {
      users[senderId].limit += amount
      users[randomUserId].limit -= amount

      const texto = `
✧ *¡Crimen exitoso!* 🕶️

➤ Robaste *${amount} ${moneda}* a @${randomUserId.split('@')[0]}
➤ Ganancia total: *+${amount} ${moneda}*

👤 Criminal: *${senderName}*

${wm}
      `.trim()

      await conn.sendMessage(m.chat, {
        text: texto,
        mentions: [randomUserId]
      }, { quoted: m })
      break
    }

    case 1: {
      let penalidad = Math.min(Math.floor(Math.random() * (senderLimit - minAmount + 1)) + minAmount, maxAmount)
      users[senderId].limit -= penalidad

      const texto = `
✧ *¡Fuiste atrapado!* 🚨

➤ Te descubrieron mientras cometías el crimen.
➤ Perdiste *-${penalidad} ${moneda}*

👤 Delincuente: *${senderName}*

${wm}
      `.trim()

      await conn.sendMessage(m.chat, { text: texto }, { quoted: m })
      break
    }

    case 2: {
      let reducido = Math.min(Math.floor(Math.random() * (randomUserLimit / 2 - minAmount + 1)) + minAmount, maxAmount)
      users[senderId].limit += reducido
      users[randomUserId].limit -= reducido

      const texto = `
✧ *Crimen a medias* 🥷

➤ Robaste a @${randomUserId.split('@')[0]}, pero te descubrieron.
➤ Ganancia parcial: *+${reducido} ${moneda}*

👤 Autor: *${senderName}*

${wm}
      `.trim()

      await conn.sendMessage(m.chat, {
        text: texto,
        mentions: [randomUserId]
      }, { quoted: m })
      break
    }
  }

  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['crimen']
handler.command = ['crimen', 'crime']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60)
  let segundosRestantes = segundos % 60
  return `${minutos}m ${segundosRestantes}s`
}