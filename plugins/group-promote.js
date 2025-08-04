var handler = async (m, { conn, usedPrefix, command, text }) => {
  let number;

  // ✿ Validación de mención o respuesta
  if (!text && !m.quoted) {
    return conn.reply(m.chat, `⚠︎︎ *¿A quién deseas hacer admin?*\n✎ Menciona o responde al usuario.`, m);
  }

  // ✿ Obtener número desde mención, texto o respuesta
  if (isNaN(text)) {
    if (text.includes('@')) number = text.split('@')[1];
  } else {
    number = text;
  }

  if (!number && m.quoted) {
    number = m.quoted.sender.split('@')[0];
  }

  if (!number) {
    return conn.reply(m.chat, `⛁ *No encontré un número válido para promover.*`, m);
  }

  if (number.length > 13 || number.length < 10) {
    return conn.reply(m.chat, `⚠︎︎ *Ese número parece inválido.*\n✎ Revisa y vuelve a intentarlo.`, m);
  }

  let user = number + '@s.whatsapp.net';

  // ✿ Intentar promoción
  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    conn.reply(m.chat, `✦ *Ascenso exitoso*\n⟡ @${number} ahora es *Administrador del grupo*.\nRecuerda usar tu poder con sabiduría. ⚿`, m, { mentions: [user] });
  } catch (e) {
    conn.reply(m.chat, `☁︎ *No pude ascender al usuario.*\nAsegúrate de que tengo permisos de administrador.`, m);
  }
};

handler.help = ['promote'];
handler.tags = ['grupo'];
handler.command = ['promote', 'darpija', 'promover'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;