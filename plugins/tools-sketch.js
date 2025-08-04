import axios from 'axios';
import crypto from 'crypto';
import https from 'https';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { fileTypeFromBuffer } from 'file-type';

function generateSessionHash() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    const byte = crypto.randomBytes(1)[0];
    result += chars[byte % chars.length];
  }
  return result;
}

function getStream(sessionHash) {
  return new Promise((resolve, reject) => {
    https.get(`https://raec25-image-to-drawing-sketch.hf.space/gradio_api/queue/data?session_hash=${sessionHash}`, res => {
      let buffer = '';
      res.on('data', chunk => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              if (data.msg === 'process_completed' && data.output?.data?.[0]?.url) {
                resolve(data.output.data[0].url);
              }
            } catch {}
          }
        }
      });
      res.on('end', () => reject('⩍⩍ El proceso fue interrumpido.'));
    }).on('error', reject);
  });
}

async function imageToSketch(imageUrl) {
  const sessionHash = generateSessionHash();
  const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  const form = new FormData();
  form.append('files', Buffer.from(imageResponse.data), {
    filename: 'input.jpg',
    contentType: 'image/jpeg',
  });

  const headers = { ...form.getHeaders() };

  const uploadRes = await axios.post(
    'https://raec25-image-to-drawing-sketch.hf.space/gradio_api/upload?upload_id=qcu1l42hpn',
    form,
    { headers }
  );

  const filePath = uploadRes.data[0];

  const payload = {
    data: [
      {
        path: filePath,
        url: `https://raec25-image-to-drawing-sketch.hf.space/file=${filePath}`,
        orig_name: 'input.jpg',
        size: 101441,
        mime_type: 'image/jpeg',
        meta: { _type: 'gradio.FileData' }
      },
      'Pencil Sketch'
    ],
    event_data: null,
    fn_index: 2,
    trigger_id: 13,
    session_hash: sessionHash
  };

  await axios.post(
    'https://raec25-image-to-drawing-sketch.hf.space/gradio_api/queue/join?__theme=system',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  const result = await getStream(sessionHash);
  return result;
}

async function catboxUpload(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'jpg', mime: 'image/jpeg' };
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, { filename: `sketch.${ext}`, contentType: mime });

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
  if (!res.ok) throw new Error('⩍⩍ Error al subir la imagen a Catbox.');
  return await res.text();
}

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw m.reply('✧ Responde a una *Imagen*.');

  m.react('🎨');
  try {
    const qimg = await q.download();
    const mediaUrl = await conn.getFile(qimg, false);
    const sketchUrl = await imageToSketch(mediaUrl.data);

    const buffer = await (await fetch(sketchUrl)).buffer();
    const catboxLink = await catboxUpload(buffer);

    await conn.sendFile(m.chat, sketchUrl, 'sketch.jpg',
`⃟🪷 *𝑰𝒎𝒂𝒈𝒆𝒏 𝒄𝒐𝒏𝒗𝒆𝒓𝒕𝒊𝒅𝒂 𝒆𝒏 𝒃𝒐𝒄𝒆𝒕𝒐:*
────────────────────
✿ 𝖣𝗂𝗌𝖿𝗋𝗎𝗍𝖺 𝗍𝗎 𝗇𝗎𝖾𝗏𝖺 𝗏𝖾𝗋𝗌𝗂𝗈𝗇 𝖾𝗇 sketch.
𐚁 𝖤𝗌𝗍𝖺 𝖾𝗌 𝗍𝗎 𝗎𝗋𝗅:
${catboxLink}
────────────────────
⩍⩍ 𝖶𝖺𝗀𝗎𝗋𝗂 𝖠𝗂 · kenisawadev`, m);
    m.react('✅');
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al convertir o subir la imagen.');
    m.react('❌');
  }
};

handler.help = ['sketch'];
handler.tags = ['tools'];
handler.command = /^sketch$/i;
export default handler;