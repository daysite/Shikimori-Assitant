import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
const { proto, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
    try {
        if (m._tourl_done) return; 
        m._tourl_done = true;

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';
        if (!mime || mime === 'conversation') return m.reply('¿Que quieres subir?');

        let media = await q.download();
        let catboxLink = await catboxUpload(media).catch(() => null);

        if (!catboxLink) throw new Error('Error al cargar el archivo a Catbox.');

        let caption = catboxLink;
        m.reply(caption)

    } catch (error) {
        conn.reply(m.chat, `Error: ${error.message || error}`, m);
    }
};

handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = /^(tourl)$/i;
handler.owner = false;

export default handler;

async function catboxUpload(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: `file.${ext}`, contentType: mime });

    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Gagal menghubungi Catbox.');
    return await res.text();
}