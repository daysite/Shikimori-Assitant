const handler = async (m, { conn, args }) => {
  const nuevoNombre = args.join(' ');
  if (!nuevoNombre) {
    return m.reply(
      '✿ Por favor, escribe el *nuevo nombre* que deseas para el grupo.\n\n✎ *Ejemplo:* `#gpname Familia Waguri ☁︎`'
    );
  }

  try {
    await conn.groupUpdateSubject(m.chat, nuevoNombre);
    await m.reply(`❀ El nombre del grupo ha sido actualizado con éxito.\n╰✦ Nuevo nombre:\n"${nuevoNombre}"`);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (e) {
    console.error(e);
    return m.reply(`⚠️ No se pudo cambiar el nombre del grupo.\n╰▶︎ *${e.message}*`);
  }
};

handler.help = ['gpname <texto>', 'groupname <texto>'];
handler.tags = ['group'];
handler.command = ['gpname', 'groupname'];
handler.group = true;
handler.admin = true;

export default handler;