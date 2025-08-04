const handler = async (m, { conn, participants, groupMetadata, args }) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null) || './src/catalogo.jpg';
  const groupAdmins = participants.filter(p => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `⭑ ${i + 1}. @${v.id.split('@')[0]}`).join('\n');
  const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
  const pesan = args.join` ` || '—';
  
  const caption = `
⩍⩍   ⃟🪷 𝙲𝙾𝙽𝚅𝙾𝙲𝙰𝚃𝙾𝚁𝙸𝙰 𝙳𝙴 𝙰𝙳𝙼𝙸𝙽𝚂  ⃟🪷  ⩍⩍

❀ 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾:
${listAdmin}

✦ 𝙼𝙴𝙽𝚂𝙰𝙹𝙴:
「 ${pesan} 」

𐚁 𝙴𝚟𝚒𝚝𝚊 𝚞𝚜𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚌𝚘𝚗 𝚒𝚗𝚝𝚎𝚗𝚌𝚒𝚘𝚗𝚎𝚜 𝚒𝚗𝚌𝚘𝚛𝚛𝚎𝚌𝚝𝚊𝚜. 𝙿𝚘𝚍𝚛í𝚊𝚜 𝚜𝚎𝚛 *eliminado* o *baneado* del bot.

─── ⋆｡°✩₊ 𝓦𝓪𝓰𝓾𝓻𝓲 𝓐𝓲
`.trim();

  await conn.sendFile(m.chat, pp, 'admins.jpg', caption, m, false, {
    mentions: [...groupAdmins.map(p => p.id), owner]
  });
};

handler.help = ['admins <texto>'];
handler.tags = ['group'];
handler.command = /^(admins|@admins|dmins)$/i;
handler.group = true;

export default handler;