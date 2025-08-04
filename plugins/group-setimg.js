import { makeWASocket } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';

  if (/image/.test(mime)) {
    let image = await q.download();
    if (!image) return m.reply('✿ Te faltó responder a una imagen para usarla como perfil del grupo.');

    try {
      await conn.updateProfilePicture(m.chat, image);
      await m.reply('❀ Se actualizó la imagen de perfil del grupo exitosamente.');
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
      m.reply(`⚠️ No se pudo cambiar la imagen del grupo.\n╰▶︎ Error: *${e.message}*`);
    }
  } else {
    return m.reply('✎ Por favor, responde a una imagen para establecerla como la nueva foto del grupo.');
  }
};

handler.command = ['gpbanner', 'setgroupimg'];
handler.help = ['setgroupimg (responde imagen)', 'gpbanner (responde imagen)'];
handler.tags = ['group'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;