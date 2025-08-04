var handler = async (m, { conn, participants, usedPrefix, command }) => {
  // ✦ Validación: verificar si hay mención o respuesta
  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `⚠︎︎ *¿A quién se supone que debo expulsar?*\n✦ Menciona o responde al mensaje del usuario.`, m);
  }

  // ✦ Obtener el objetivo
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  // ✦ Obtener info del grupo y dueños
  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

  // ✧ Protecciones
  if (user === conn.user.jid) {
    return conn.reply(m.chat, `☁︎ *¿Expulsarme a mí?* Qué atrevido... pero no 😌`, m);
  }

  if (user === ownerGroup) {
    return conn.reply(m.chat, `⚿ *No se puede* expulsar al creador del grupo. Incluso yo tengo límites.`, m);
  }

  if (user === ownerBot) {
    return conn.reply(m.chat, `☁︎ *Ese es mi desarrollador*... ¡y no pienso tocarlo!`, m);
  }

  // ✦ Intentar expulsión
  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    conn.reply(m.chat, `✿ *Usuario eliminado con estilo.*`, m);
  } catch (e) {
    conn.reply(m.chat, `⚠︎︎ *No fue posible expulsarlo.*\nAsegúrate de que tengo permisos de administrador.`, m);
  }
};

handler.help = ['kick'];
handler.tags = ['group'];
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.register = true;

export default handler;