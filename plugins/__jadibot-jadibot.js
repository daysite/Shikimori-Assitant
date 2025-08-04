import Jadibot from '../lib/jadibot.js'
import Jadibots from '../lib/jadibots.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const userId = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
  const number = userId.split('@')[0]

  if (!userId || userId === '@s.whatsapp.net') {
    return m.reply('✧ El número introducido no es válido.')
  }

  if (Jadibots.conns.has(number)) {
    return await conn.sendMessage(m.chat, {
      text: '❀ Ya eres un Subbot activo.',
      footer: '¿Quieres borrar la sesión? ',
      buttons: [
       { buttonId: `${usedPrefix}cerrarsesion`, buttonText: { displayText: 'Borrar Sesión' }, type: 1 }
        ],
        headerType: 1
        }, { quoted: m })
  }

  if (!text) {
    return await conn.sendMessage(m.chat, {
      text: `❀ *Convertirte en Subbot* ❀\n\nSelecciona un método de vinculación para el número *${number}*:`,
      footer: 'Waguri Ai • kenisawadev',
      buttons: [
        { buttonId: `${usedPrefix}code ${number}`, buttonText: { displayText: '📲 Código de Vinculación' }, type: 1 },
        { buttonId: `${usedPrefix}qr ${number}`, buttonText: { displayText: '📷 Escanear QR' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m })
  }

  const useCode = !/qr(?:\s?code)?/i.test(command)

  try {
    await Jadibot(userId, conn, m, useCode)
  } catch (err) {
    throw m.reply(`✧ Error: ${err?.message || err}`)
  }
}

handler.help = ['jadibot', 'serbot', 'code']
handler.tags = ['jadibot']
handler.command = /^(jadibot|code|serbot|qr)$/i
handler.premium = false

export default handler