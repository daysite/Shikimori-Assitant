let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✿ 𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚞𝚗 𝚗ú𝚖𝚎𝚛𝚘.\n➪ Ejemplo: *${usedPrefix + command} 549*`, m);
  if (text.includes('+')) return m.reply(`✿ 𝙽𝚘 𝚞𝚜𝚎𝚜 𝚎𝚕 símbolo *+*.\n➪ Escribe el número todo junto.`, m);
  if (isNaN(text)) return m.reply(`✿ 𝙴𝚜𝚌𝚛𝚒𝚋𝚎 𝚜ó𝚕𝚘 𝚗ú𝚖𝚎𝚛𝚘𝚜 sin espacios ni letras.`, m);

  let jid = text.replace(/\D/g, '') + '@s.whatsapp.net';
  let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat);

  await conn.reply(jid, 
`⩍⩍  𝙸𝙽𝚅𝙸𝚃𝙰𝙲𝙸𝙾𝙽 𝙰 𝙶𝚁𝚄𝙿𝙾  ⃟🪷

Un miembro del grupo te ha enviado una invitación:

✎ *Grupo:* ${await conn.getName(m.chat)}
✎ *Invitación:* ${link}

─── ⋆｡°✩₊ 𝓦𝓪𝓰𝓾𝓻𝓲 𝓐𝓲`, m);

  m.reply(`❀ 𝙻𝚒𝚗𝚔 𝚍𝚎 𝚒𝚗𝚟𝚒𝚝𝚊𝚌𝚒ó𝚗 𝚎𝚗𝚟𝚒𝚊𝚍𝚘 𝚊 *${text}* con éxito.`);
};

handler.help = ['add <número>'];
handler.tags = ['group'];
handler.command = ['add', 'agregar', 'añadir'];

handler.group = true;
handler.botAdmin = true;

export default handler;