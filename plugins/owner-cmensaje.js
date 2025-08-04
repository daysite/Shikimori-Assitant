import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
const { proto, prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text }) => {

let texto_a_copiar = "Xd"
let id_canal = `120363348355703366@newsletter`
    try {
        if (m._tourl_done) return; 
        m._tourl_done = true;

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';
        if (!text) return m.reply("Ingresa el texto del mensaje")
        if (!mime || mime === 'conversation') return m.reply('Responde a la imagen para subir con el mensaje');

        let media = await q.download();
        let catboxLink = await catboxUpload(media).catch(() => null);

        if (!catboxLink) throw new Error('Error al cargar el archivo a Catbox.');

        let caption = text;

        let thumbnail = await prepareWAMessageMedia(
            { image: { url: catboxLink } },
            { upload: conn.waUploadToServer }
        );

        let buttons = [
            {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Copiar",
                    copy_code: texto_a_copiar
                })
            }
        ];

        let msg = {
            interactiveMessage: proto.Message.InteractiveMessage.create({
                header: proto.Message.InteractiveMessage.Header.create({
                    hasMediaAttachment: true,
                    ...thumbnail
                }),
                body: proto.Message.InteractiveMessage.Body.create({ text: caption }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                    text: ""
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons
                })
            })
        };

        await conn.relayMessage(id_canal, msg, { messageId: m.key.id });
        m.reply("Mensaje enviado con éxito, para cambiar la id y el texto a copiar edita el plugin de ./plugins/owner-cmensaje.js")
    } catch (error) {
        conn.reply(m.chat, `Error: ${error.message || error}`, m);
    }
};

handler.help = ['cmensaje'];
handler.tags = ['ownee'];
handler.command = /^(cmensaje)$/i;
handler.owner = true;

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