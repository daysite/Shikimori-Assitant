let handler = async (m, { conn, usedPrefix, command, text }) => {
  let number;

  // Extraer número del texto o mención
  if (isNaN(text) && !text.includes('@')) {
    // texto inválido, se ignora
  } else if (isNaN(text)) {
    number = text.split`@`[1];
  } else if (!isNaN(text)) {
    number = text;
  }

  if (!text && !m.quoted) {
    return conn.reply(m.chat, `
⚠︎  𝙄𝙉𝙎𝙏𝙍𝙐𝘾𝘾𝙄𝙊𝙉 𝙍𝙀𝙌𝙐𝙀𝙍𝙄𝘿𝘼 ✎

✿ Debes mencionar o responder al mensaje de la persona que deseas *degradar de administrador*.
`.trim(), m);
  }

  if (number && (number.length > 13 || number.length < 10)) {
    return conn.reply(m.chat, `
✘ El número ingresado no es válido para esta acción.
`.trim(), m);
  }

  try {
    let user;
    if (text) {
      user = number + '@s.whatsapp.net';
    } else if (m.quoted?.sender) {
      user = m.quoted.sender;
    } else if (m.mentionedJid?.length) {
      user = m.mentionedJid[0];
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');

    await conn.reply(m.chat, `
❀ 𝘿𝙀𝙂𝙍𝘼𝘿𝘼𝘾𝙄Ó𝙉 𝘼𝘾𝙏𝙄𝙑𝘼 ✎

⟿ El usuario *@${user.split('@')[0]}* ha sido *removido como administrador* de este grupo.

𐚁 Esta acción es irreversible salvo que vuelva a ser promovido.
`.trim(), m, { mentions: [user] });

  } catch (e) {
    conn.reply(m.chat, 'Ocurrió un error al intentar degradar al usuario.', m);
    console.error(e);
  }
};

handler.help = ['demote'];
handler.tags = ['group'];
handler.command = ['demote', 'degradar', 'quitaradmin'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;