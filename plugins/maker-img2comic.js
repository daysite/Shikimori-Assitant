import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

async function catboxUpload(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime });

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
  if (!res.ok) throw new Error('Error al subir la imagen a Catbox.');
  return await res.text();
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime || !/image\/(jpe?g|png|webp)/.test(mime)) return m.reply(`✧ Envía o responde a una imagen para convertirla al estilo cómic.\n\n✧ Ejemplo: ${usedPrefix + command}`);

  await conn.sendMessage(m.chat, { react: { text: '🖌️', key: m.key } });

  try {
    const imgBuffer = await q.download();
    const imageUrl = await catboxUpload(imgBuffer);

    const api = `https://zenzxz.dpdns.org/maker/img2comic?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(api);
    const resultBuffer = await res.buffer();

    await conn.sendFile(m.chat, resultBuffer, 'comic.jpg', '🖼️ Aquí tienes tu imagen estilo cómic:', m);
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al generar la imagen estilo cómic.');
  }
};

handler.command = /^img2comic$/i;
handler.help = ['img2comic'];
handler.tags = ['maker'];

export default handler;