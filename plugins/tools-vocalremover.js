import axios from 'axios';
import FormData from 'form-data';
import { downloadMediaMessage } from '@adiwajshing/baileys';

const handler = async (m, { conn, args, usedPrefix, command }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
  let url = args[0];
  let quoted = m.quoted || m;

  if (!(url?.endsWith('.mp3')) && !quoted?.audioMessage)
    return conn.reply(m.chat, `✧ Responde a un audio o envía un link .mp3 válido\nEj: ${usedPrefix + command} https://example.com/audio.mp3`, m);

  await m.react('🎙️');

  try {
    // Obtener audio
    let audioBuffer;
    if (quoted?.audioMessage) {
      audioBuffer = await downloadMediaMessage(quoted, 'buffer', {}, { logger: conn.logger });
    } else {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      audioBuffer = res.data;
    }

    // Subir al vocal remover
    const { key, file_name } = await uploadAudio(audioBuffer);
    const { vocal, instrumental } = await processAudio(file_name, key);

    // Subir ambas pistas a catbox
    const vocalCatbox = await uploadToCatbox(vocal);
    const instrumentalCatbox = await uploadToCatbox(instrumental);

    // Enviar las pistas por separado
    await conn.sendMessage(m.chat, {
      audio: { url: instrumental },
      mimetype: 'audio/mpeg',
      fileName: 'instrumental.mp3',
      ptt: false
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: vocal },
      mimetype: 'audio/mpeg',
      fileName: 'vocal.mp3',
      ptt: false
    }, { quoted: m });

    // Enviar enlaces + botones
    await conn.sendMessage(m.chat, {
      text: `🎧 *Separación completada:*\n\n• 🎼 Instrumental:\n${instrumentalCatbox}\n\n• 🎤 Voz:\n${vocalCatbox}`,
      footer: settings.wm,
      buttons: [
        {
          buttonId: `${usedPrefix}menu`,
          buttonText: { displayText: '📜 Menú Principal' },
          type: 1
        },
        {
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '📥 Enlaces para abrir:',
              sections: [
                {
                  title: '🔉 Audios en Catbox',
                  rows: [
                    {
                      title: '🎼 Abrir Instrumental',
                      description: 'Ver en navegador',
                      id: instrumentalCatbox
                    },
                    {
                      title: '🎤 Abrir Voz',
                      description: 'Ver en navegador',
                      id: vocalCatbox
                    }
                  ]
                }
              ]
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, `✖️ Error al procesar el audio:\n${e.message}`, m);
  }
};

handler.command = ['vocalremover', 'separarvoz'];
handler.help = ['vocalremover (responde a audio o link .mp3)'];
handler.tags = ['audio', 'tools'];
export default handler;

// === Funciones ===

async function uploadAudio(buffer) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);

  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\n`),
    Buffer.from(`Content-Disposition: form-data; name="fileName"; filename="audio.mp3"\r\n`),
    Buffer.from(`Content-Type: audio/mpeg\r\n\r\n`),
    Buffer.from(buffer),
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const res = await axios.post('https://aivocalremover.com/api/v2/FileUpload', multipartBody, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length,
      'User-Agent': 'Mozilla/5.0',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const { data } = res;
  if (data?.error) throw new Error(data.message);
  return { key: data.key, file_name: data.file_name };
}

async function processAudio(file_name, key) {
  const params = new URLSearchParams({
    file_name,
    action: 'watermark_video',
    key,
    web: 'web'
  });

  const res = await axios.post('https://aivocalremover.com/api/v2/ProcessFile', params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'Mozilla/5.0',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const { data } = res;
  if (data?.error) throw new Error(data.message);
  return { vocal: data.vocal_path, instrumental: data.instrumental_path };
}

async function uploadToCatbox(fileUrl) {
  const res = await axios.get(fileUrl, { responseType: 'arraybuffer' });
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', Buffer.from(res.data), { filename: 'audio.mp3' });

  const uploadRes = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders()
  });

  return uploadRes.data;
}