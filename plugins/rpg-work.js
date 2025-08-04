let cooldowns = {}

let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const tiempoEspera = 5 * 60 // 5 minutos

  // Verificar cooldown
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `✧ Ya trabajaste recientemente.\n\n⏱ Espera *${tiempoRestante}* antes de volver a trabajar.`, m)
  }

  // Generar ganancia
  const resultado = Math.floor(Math.random() * 5000)
  user.exp += resultado
  cooldowns[m.sender] = Date.now()

  const mensaje = `
🛠️ *Jornada de Trabajo Completada*

✧ ${pickRandom(works)}:
➪ Ganancia: *+${toNum(resultado)} XP 💫*

Sigue trabajando para subir de nivel.

${wm}
  `.trim()

  await conn.reply(m.chat, mensaje, m)
}

handler.help = ['work', 'trabajar']
handler.tags = ['rpg']
handler.command = ['w', 'work', 'trabajar']
handler.register = true

export default handler

// Utilidades

function toNum(number) {
  if (number >= 1e6) return (number / 1e6).toFixed(1) + 'M'
  if (number >= 1e3) return (number / 1e3).toFixed(1) + 'k'
  return number.toString()
}

function segundosAHMS(segundos) {
  const min = Math.floor((segundos % 3600) / 60)
  const seg = segundos % 60
  return `${min} minutos y ${seg} segundos`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const works = [
  "Trabajaste como cortador de galletas y ganaste",
  "Organizaste un evento de vinos y obtuviste",
  "Limpiaste la chimenea y encontraste",
  "Fuiste programador freelance y ganaste",
  "Trabajaste como repartidor de ramen por",
  "Actuaste como Bob Esponja y cobraste",
  "Vendiste ítems en un mercado local por",
  "Reparaste un tanque y recibiste",
  "Fuiste disfrazado de panda en Disneyland y ganaste",
  "Realizaste trabajo social y fuiste recompensado con",
  "Trabajaste como artista callejero y obtuviste",
  "Desarrollaste un juego y te pagaron",
  "Fuiste instructor de yoga en la playa por",
  "Resolviste un crimen y te premiaron con",
  "Reciclaste basura electrónica y ganaste",
  "Vendiste sándwiches de pescado y recibiste"
]