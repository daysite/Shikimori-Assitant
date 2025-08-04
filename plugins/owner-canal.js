import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const canalID = '120363348355703366@newsletter'; // ← reemplaza con el JID real de tu canal

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';

  // Texto simple
  if (!mime && m.text) {
    await conn.sendMessage(canalID, { text: m.text });
    return m.reply('✅ Mensaje de texto enviado al canal.');
  }

  // Multimedia (imagen o video)
  if (/image|video/.test(mime)) {
    let media = await q.download();
    if (!media) return m.reply('❌ No se pudo descargar el archivo.');

    // Subir a Catbox
    let form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', media, 'media');

    let res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form,
    });

    let url = await res.text();
    if (!url.startsWith('https://')) return m.reply('❌ Error al subir a Catbox.');

    // Enviar al canal
    await conn.sendMessage(canalID, {
      [mime.includes('image') ? 'image' : 'video']: { url },
      caption: args.join(' ') || '',
    });

    return m.reply(`✅ Enviado correctamente al canal.\n🌐 URL: ${url}`);
  }

  return m.reply(`❌ Formato no soportado.\nResponde a una imagen, video o envía un texto.`);
};

handler.help = ['postcanal [texto|imagen|video]'];
handler.tags = ['tools'];
handler.command = /^postcanal$/i;
handler.owner = true;

export default handler;