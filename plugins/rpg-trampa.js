let handler = async (m, { conn, text, usedPrefix, command }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  const moneda = settings.moneda_rpg || '💰'

  const args = text.trim().split(/ +/)
  const eris = parseInt(args[0])
  const xp = parseInt(args[1])

  if (isNaN(eris) || isNaN(xp)) {
    return m.reply(`✧ Formato incorrecto.

➪ *Uso:* ${usedPrefix + command} <${moneda}> <XP>
➪ *Ejemplo:* ${usedPrefix + command} 5000 1000`)
  }

  let user = global.db.data.users[m.sender]
  user.bank += eris
  user.exp += xp

  const mensaje = `
🧪 *Modo Cheat Activado*

✧ Monedas añadidas: *+${eris} ${moneda}*
✧ Experiencia añadida: *+${xp} XP*

✔️ Aplicado con éxito, *KenisawaDev*.

${wm}
  `.trim()

  m.reply(mensaje)
}

handler.help = ['cheatyo <Coins> <XP>']
handler.tags = ['owner']
handler.command = /^cheatyo$/i
handler.rowner = true // solo real owner

export default handler