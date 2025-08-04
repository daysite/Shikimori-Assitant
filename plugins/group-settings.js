let handler = async (m, { conn, args, usedPrefix, command }) => {
  const estado = (args[0] || '').toLowerCase()
  const accion = {
    'abrir': 'not_announcement',
    'cerrar': 'announcement',
  }[estado]

  if (!accion) {
    const buttons = [
      { buttonId: `${usedPrefix + command} abrir`, buttonText: { displayText: '🔓 Abrir Grupo' }, type: 1 },
      { buttonId: `${usedPrefix + command} cerrar`, buttonText: { displayText: '🔒 Cerrar Grupo' }, type: 1 }
    ]

    return await conn.sendMessage(m.chat, {
      text: `
┏━🌷  𝙂𝙧𝙪𝙥𝙤 𝙈𝙤𝙙𝙤 𝘼𝙙𝙢𝙞𝙣  🌷━┓

Puedes controlar si los miembros pueden enviar mensajes:

╭───❍ *Opciones:*
│○ ${usedPrefix + command} abrir
│○ ${usedPrefix + command} cerrar
╰─────────────❍

O usa los botones ↓

`.trim(),
      footer: 'Waguri Ai ✧ Administración de grupos',
      buttons,
      headerType: 1
    }, { quoted: m })
  }

  await conn.groupSettingUpdate(m.chat, accion)

  let estadoTexto = accion === 'not_announcement'
    ? '🔓 *Grupo abierto*\n> Todos los miembros pueden enviar mensajes.'
    : '🔒 *Grupo cerrado*\n> Solo los administradores pueden enviar mensajes.'

  await conn.sendMessage(m.chat, {
    text: `🍓 *Configuración actualizada*\n\n${estadoTexto}`,
    contextInfo: {
      externalAdReply: {
        title: '✧ Waguri Ai • Keis Net',
        body: 'Panel de administración activo',
        thumbnailUrl: 'https://files.catbox.moe/vxvobj.jpg',
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: 'https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F'
      }
    }
  }, { quoted: m })
}

handler.help = ['gc *abrir / cerrar*']
handler.tags = ['group']
handler.command = /^(grupo|gc)$/i

handler.admin = true
handler.botAdmin = true

export default handler