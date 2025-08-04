let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) {
    return conn.reply(m.chat, `
⚠︎  𝙀𝙇𝙄𝙈𝙄𝙉𝙰𝙍 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 ✎

✿ Por favor, *responde* al mensaje que deseas eliminar del grupo.
𐚁 Este comando requiere citar un mensaje previamente enviado.
`.trim(), m);
  }

  try {
    let user = m.message.extendedTextMessage.contextInfo.participant;
    let messageId = m.message.extendedTextMessage.contextInfo.stanzaId;

    return conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: user
      }
    });
  } catch {
    // Intento alternativo por compatibilidad
    return conn.sendMessage(m.chat, {
      delete: m.quoted.vM.key
    });
  }
};

handler.help = ['delete'];
handler.tags = ['grupo'];
handler.command = ['del', 'delete'];
handler.group = false;
handler.admin = true;
handler.botAdmin = true;

export default handler;