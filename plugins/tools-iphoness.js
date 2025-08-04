const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `╭═ 🜲 𝑼𝒔𝒐 𝒄𝒐𝒓𝒓𝒆𝒄𝒕𝒐 🜲 ═╮\n│ ✦ ${usedPrefix + command} <mensaje>\n│ ✦ Ej: ${usedPrefix + command} Hola Kenisawa\n╰═══════════════════════╯`

  const mensaje = encodeURIComponent(text)
  const posicion = 'left' // Puedes cambiar a 'right' si deseas
  const hora = new Date().toTimeString().slice(0, 5) // hora actual en formato HH:MM
  const url = `https://velyn.mom/api/maker/iqc?message=${mensaje}&position=${posicion}&jam=${hora}`

  try {
    await conn.sendMessage(m.chat, { image: { url }, caption: `🧿 𝑪𝒂𝒑𝒕𝒖𝒓𝒂 𝒆𝒔𝒕𝒊𝒍𝒐 𝑰𝒑𝒉𝒐𝒏𝒆\n\n🗨️ 𝑴𝒆𝒏𝒔𝒂𝒋𝒆: *${text}*\n🕰️ 𝑯𝒐𝒓𝒂: *${hora}*` }, { quoted: m })
  } catch (err) {
    console.error(err)
    throw '⚠️ 𓆩 Error al generar la imagen. Intenta más tarde.'
  }
}

handler.help = ['iphoness *<mensaje>*']
handler.tags = ['maker', 'fun']
handler.command = /^iphoness|iphonechat|chatstyle$/i
handler.limit = true
handler.register = true

export default handler