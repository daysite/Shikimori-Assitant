import { generateWAMessageFromContent } from '@adiwajshing/baileys';

let handler = async (m, { conn, text, participants }) => {
  if (!text && !m.quoted) return m.reply('✎ Debes responder a un mensaje o escribir un texto para notificar al grupo.');

  const users = participants.map(u => conn.decodeJid(u.id));
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || '';
  const isMedia = /image|video|sticker|audio/.test(mime);
  const hiddenText = text ? text : '*☁︎ Notificación*';
  const invisible = String.fromCharCode(8206).repeat(850); // oculta la mención en el mensaje
  const finalText = `${invisible}\n${hiddenText}`;

  try {
    if (isMedia && quoted.mtype === 'imageMessage') {
      const media = await quoted.download();
      await conn.sendMessage(m.chat, {
        image: media,
        caption: hiddenText,
        mentions: users
      }, { quoted: null });

    } else if (isMedia && quoted.mtype === 'videoMessage') {
      const media = await quoted.download();
      await conn.sendMessage(m.chat, {
        video: media,
        mimetype: 'video/mp4',
        caption: hiddenText,
        mentions: users
      }, { quoted: null });

    } else if (isMedia && quoted.mtype === 'audioMessage') {
      const media = await quoted.download();
      await conn.sendMessage(m.chat, {
        audio: media,
        mimetype: 'audio/mp4',
        ptt: false,
        fileName: 'Notificación.mp3',
        mentions: users
      }, { quoted: null });

    } else if (isMedia && quoted.mtype === 'stickerMessage') {
      const media = await quoted.download();
      await conn.sendMessage(m.chat, {
        sticker: media,
        mentions: users
      }, { quoted: null });

    } else {
      // Texto plano con mención oculta
      await conn.relayMessage(
        m.chat,
        {
          extendedTextMessage: {
            text: finalText,
            contextInfo: { mentionedJid: users }
          }
        },
        {}
      );
    }
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al intentar enviar la notificación oculta.');
  }
};

handler.help = ['hidetag <texto o responder media>'];
handler.tags = ['group'];
handler.command = ['hidetag', 'notificar', 'notify', 'tag'];
handler.group = true;
handler.admin = true;

export default handler;