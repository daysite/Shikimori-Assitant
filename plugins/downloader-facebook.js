import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { conn, args, text }) => {
    if (!text) return reply("🔗 ¡Introduce la URL de Facebook!");

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    let res = await downloadFacebook(text);
    if (res.error) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply(`⚠ *Error:* ${res.error}`);
    }

    await conn.sendMessage(m.chat, { 
        video: { url: res.video }, 
        caption: "✅ *¡Video de Facebook descargado exitosamente!*" 
    }, { quoted: m });
};

handler.help = ['fb *<link>*']
handler.tags = ['downloader']
handler.command = /^(fbdownload|facebook|fb(dl)?)$/i

handler.limit = true
handler.register = true

export default handler

async function downloadFacebook(url) {
    try {
        const form = new URLSearchParams();
        form.append("q", url);
        form.append("vt", "home");

        const { data } = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (data.status !== "ok") throw new Error("Gagal mengambil data.");

        const $ = cheerio.load(data.data);
        const thumb = $('img').attr("src");
        let links = [];

        $('table tbody tr').each((_, el) => {
            const quality = $(el).find('.video-quality').text().trim();
            const link = $(el).find('a.download-link-fb').attr("href");
            if (quality && link) links.push({ quality, link });
        });

        if (links.length === 0) throw new Error("Tidak ada video yang dapat diunduh.");

        return { thumb, video: links[0].link };
    } catch (error) {
        return { error: error.message };
    }
}