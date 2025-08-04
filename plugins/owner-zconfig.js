let handler = async (m, { conn, args, usedPrefix, command, isROwner, isOwner }) => {
  if (!(isROwner || isOwner)) return m.reply('⛔ Este comando solo puede ser usado por el owner.')

  let settings = global.db.data.settings[conn.user.jid]
  if (!settings || typeof settings !== 'object') global.db.data.settings[conn.user.jid] = {}
  settings = global.db.data.settings[conn.user.jid]

  const defaults = {
    self: false,
    autoread: true,
    anticall: true,
    restartDB: 0,
    restrict: false,
    botIcon: 'https://files.catbox.moe/gi65bh.png',
    menuMedia: 'https://files.catbox.moe/w4pmmz.jpg',
    botName: 'Waguri Ai',
    moneda_rpg: 'Eris',
    wm: 'Waguri x KenisawaDev',
    owner_numero: ['5493865642938', '0'],
    owner_nombre: 'KenisawaDev',
    link_owner: 'https://wa.me/5493865642938',
    canal_owner: 'https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F',
    id_canal_owner: '120363348355703366'
  }
  for (let key in defaults) if (!(key in settings)) settings[key] = defaults[key]

  // ──────────────────────────────────────────────────────────────────────────────

  let key = args[0]
  let value = args.slice(1).join(' ')

  if (!key) {
    return m.reply(`⚙️ Usa el comando así:

- Ver valor de una clave:
  ${usedPrefix + command} botName

- Cambiar valor:
  ${usedPrefix + command} botName Waguri Ai

- Ver todas las claves:
  ${usedPrefix + command} show

🛠️ Claves disponibles:
${Object.keys(defaults).join(', ')}`)
  }

  if (key === 'show') {
    let estado = Object.entries(settings).map(([k, v]) => `• ${k} = ${JSON.stringify(v)}`).join('\n')
    return m.reply(`⚙️ *Configuraciones actuales:*\n\n${estado}`)
  }

  if (!(key in settings)) {
    return m.reply(`❌ Clave *${key}* no válida. Usa:\n\n${usedPrefix + command} show\n\n🔑 Claves disponibles:\n${Object.keys(defaults).join(', ')}`)
  }

  if (!value) {
    return m.reply(`🔍 Valor actual de *${key}*:\n➤ ${JSON.stringify(settings[key])}`)
  }

  // Convertir tipos
  if (value === 'true') value = true
  else if (value === 'false') value = false
  else if (!isNaN(value) && typeof defaults[key] === 'number') value = Number(value)
  else if (Array.isArray(defaults[key])) value = value.split(',').map(v => v.trim())

  settings[key] = value
  m.reply(`✅ Clave *${key}* actualizada a:\n➤ ${JSON.stringify(value)}`)
}

handler.help = ['zconfig [clave] [valor]']
handler.tags = ['owner']
handler.command = /^zconfig$/i
handler.rowner = true

export default handler