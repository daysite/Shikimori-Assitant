let handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('✎ Este comando solo funciona en grupos.');

  const metadata = await conn.groupMetadata(m.chat);
  const admins = metadata.participants.filter(p => p.admin);
  const owner = metadata.owner || admins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
  const desc = metadata.desc?.toString() || '*─ Sin descripción ─*';
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => 'https://telegra.ph/file/265c672094dfa87caea19.jpg');

  let info = `
┌─ ❍ *Información del Grupo* ❍
│
│ ⛁ *Nombre:* ${metadata.subject}
│ ⚿ *ID:* ${metadata.id}
│ ✿ *Miembros:* ${metadata.participants.length}
│ ⚝ *Admins:* ${admins.length}
│ ⎯⎯⎯⎯⎯⎯⎯⎯
│ ☁︎ *Descripción:*
│ ${desc}
└──────

📷 *Foto del grupo incluida.*
`.trim();

  await conn.sendFile(m.chat, pp, 'grupoinfo.jpg', info, m);
};

handler.help = ['grupoinfo'];
handler.tags = ['group'];
handler.command = ['grupoinfo', 'infogrupo', 'gpinfo'];
handler.group = true;

export default handler;