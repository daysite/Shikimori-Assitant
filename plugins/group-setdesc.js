const handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('✿ Debes escribir una nueva descripción para el grupo.\n\n✎ *Ejemplo:* `#gpdesc Bienvenidos al reino Waguri.`');

  const nuevaDesc = args.join(' ');
  try {
    await conn.groupUpdateDescription(m.chat, nuevaDesc);
    m.reply('❀ La descripción del grupo se actualizó correctamente.\n╰✦ Nueva descripción:\n' + nuevaDesc);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    m.reply(`⚠️ Ocurrió un error al cambiar la descripción del grupo.\n╰▶︎ *${e.message}*`);
  }
};

handler.help = ['gpdesc <texto>', 'groupdesc <texto>'];
handler.tags = ['grupo'];
handler.command = ['gpdesc', 'groupdesc'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;