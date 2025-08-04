const handler = async (m, { conn, participants, command }) => {

  try {
    // Obtener el enlace de invitación
    const inviteCode = await conn.groupInviteCode(m.chat)
    const inviteLink = `https://chat.whatsapp.com/${inviteCode}`

    return conn.reply(m.chat, `🔗 *Enlace de invitación del grupo:*\n${inviteLink}`, m)
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ *No puedo obtener el enlace. Asegúrate que el bot es administrador.*', m)
  }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'invitelink', 'enlace']

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler