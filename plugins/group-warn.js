const handler = async (m, { conn, text }) => {
  const pp = './src/catalogo.jpg'
  let who

  if (m.isGroup) {
    who = m.mentionedJid?.[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
        ? m.quoted.sender 
        : false
  } else who = m.chat

  if (!who) {
    return m.reply(
      `⛁ *Advertencia Inválida*\n✿ Debes *etiquetar* a un usuario o *responder* un mensaje para advertir.`,
      m.chat
    )
  }

  const user = global.db.data.users[who]
  const motivo = text?.replace(/@\d+/g, '').trim() || 'Sin motivo especificado'

  // Protección contra advertencia al Owner
  const senderId = m.sender.replace(/@s\.whatsapp\.net$/, '')
  const isOwner = global.owner.some(([id]) => id === senderId)

  if (isOwner) {
    return conn.reply(m.chat, '⚠️ No puedes advertirte a ti mismo como owner.', m)
  }

  // Aumentar advertencia
  user.warn += 1

  const advertencia = `
⩍⩍   ⃟🪷 𝚂𝙴 𝙷𝙰 𝙴𝙼𝙸𝚃𝙸𝙳𝙾 𝚄𝙽𝙰 𝙰𝙳𝚅𝙴𝚁𝚃𝙴𝙽𝙲𝙸𝙰 ⃟🪷

✿ Usuario: *@${who.split`@`[0]}*
✿ Motivo: _${motivo}_
✿ Estado: *${user.warn}/3 advertencias*

𐚁 𝙰𝚕 𝚊𝚌𝚞𝚖𝚞𝚕𝚊𝚛 𝟹 𝚜𝚎𝚛á 𝚎𝚕𝚒𝚖𝚒𝚗𝚊𝚍𝚘 𝚍𝚎𝚕 𝚐𝚛𝚞𝚙𝚘.
`.trim()

  await m.reply(advertencia, null, { mentions: [who] })

  if (user.warn >= 3) {
    user.warn = 0
    const expulsado = `
☁︎ *Expulsión ejecutada*

✿ Usuario: *@${who.split`@`[0]}*
✿ Causa: Excedió el límite de advertencias (3/3)

𐚁 𝚁𝚎𝚌𝚞𝚎𝚛𝚍𝚊: 𝚎𝚕 𝚛𝚎𝚜𝚙𝚎𝚝𝚘 𝚎𝚜 𝚎𝚜𝚎𝚗𝚌𝚒𝚊𝚕 𝚎𝚗 𝙰𝚛𝚟𝚊𝚗𝚍𝚘𝚛.
`.trim()

    await m.reply(expulsado, null, { mentions: [who] })
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
  }
}

handler.command = ['advertir', 'advertencia', 'warn', 'warning']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler