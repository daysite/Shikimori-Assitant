import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const types = ['removebg', 'enhance', 'upscale', 'restore', 'colorize'];

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text || !types.includes(text)) {
            return m.reply(`✿ Uso correcto:\n*${usedPrefix + command} [tipo]*\n\nTipos disponibles:\n${types.map(t => `◦ ${t}`).join('\n')}`);
        }

        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || q.mediaType || '';
        if (!mime || !mime.startsWith('image')) return m.reply('✿ Responde a una imagen para usar este comando.');

        const buffer = await q.download();
        const resultUrl = await imagetools(buffer, text);
        if (!resultUrl) throw new Error('❌ No se pudo procesar la imagen.');

        await conn.sendMessage(m.chat, {
            image: { url: resultUrl },
            caption: `✿ Resultado de: *${text}*\n\n🌸 Elige otro tipo si deseas volver a procesar la imagen.`,
            buttons: types.filter(t => t !== text).map(t => ({
                buttonId: `${usedPrefix + command} ${t}`,
                buttonText: { displayText: `🖼 ${t}` },
                type: 1
            })),
        }, { quoted: m });

    } catch (e) {
        m.reply(`❌ Error: ${e.message}`);
    }
};

handler.help = ['imagetools <tipo>'];
handler.tags = ['tools', 'ai'];
handler.command = /^(imagetools)$/i;

export default handler;

// Función de procesamiento de imagen
async function imagetools(buffer, type) {
    const form = new FormData();
    form.append('file', buffer, `${Date.now()}_waguri.jpg`);
    form.append('type', type);
    
    const { data } = await axios.post('https://imagetools.rapikzyeah.biz.id/upload', form, {
        headers: form.getHeaders(),
    });
    
    const $ = cheerio.load(data);
    const res = $('img#memeImage').attr('src');
    if (!res) throw new Error('No se encontró resultado');
    return res;
}