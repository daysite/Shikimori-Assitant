import fetch from 'node-fetch';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let text = args.join(' ');
  let quoted = m.quoted || m;
  let mime = quoted?.mimetype || '';

  if (!text) return conn.reply(m.chat, `✧ Escribe un prompt. Ej: *${usedPrefix + command} fondo de fuego*`, m);

  let mediaUrl = '';
  if (/image/.test(mime)) {
    let buffer = await quoted.download();
    const url = await uploadToCatbox(buffer);
    if (!url) throw '✖️ No se pudo subir la imagen.';
    mediaUrl = url;
  } else if (args[1]?.startsWith('http')) {
    mediaUrl = args[1];
  } else {
    return conn.reply(m.chat, `✧ Responde a una imagen o proporciona una URL válida.`, m);
  }

  await m.react('🧠');
  try {
    const endpoint = `https://api.rapikzyeah.biz.id/api/ai/geminiedit?text=${encodeURIComponent(text)}&imgurl=${encodeURIComponent(mediaUrl)}`;
    const res = await fetch(endpoint);
    const json = await res.json();

    if (!json.status || !json.result) throw '✖️ Error al generar la imagen.';

    await conn.sendMessage(m.chat, {
      image: { url: json.result }
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, `✖️ No se pudo generar la imagen.`, m);
  }
};

handler.command = ['geminiimg', 'geminimg'];
handler.help = ['geminiimg <prompt> (responde a imagen o da URL)'];
handler.tags = ['ai'];

export default handler;

async function uploadToCatbox(buffer) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, {
    filename: 'img.jpg',
    contentType: 'image/jpeg'
  });

  try {
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });
    const url = await res.text();
    if (!url.startsWith('http')) return null;
    return url;
  } catch (e) {
    console.error('Catbox error:', e);
    return null;
  }
}