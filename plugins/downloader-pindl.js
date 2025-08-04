import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`❀ 𝙴𝙹𝙴𝙼𝙿𝙻𝙾:
➪ ${usedPrefix + command} https://pin.it/IEwqbsfdI`);

  try {
    const url = `https://www.apis-anomaki.zone.id/downloader/pindl?link=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.status || !json.result.success) throw '✖️ No se pudo obtener el contenido de Pinterest.';

    const data = json.result.data;
    const title = data.headline || 'Sin título';
    const image = data.image;
    const video = data.direct_mp4;

    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video },
        caption: `⩍⩍ 𝙿𝙸𝙽𝚃𝙴𝚁𝙴𝚂𝚃 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 ⩍⩍\n── 𝙲𝚘𝚗𝚝𝚎𝚗𝚒𝚍𝚘 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚍𝚘 ──\n\n🎬 *Título:* ${title}\n🌐 *Usuario:* ${data.profile_name}`
      }, { quoted: m });
    } else if (image) {
      await conn.sendMessage(m.chat, {
        image: { url: image },
        caption: `⩍⩍ 𝙸𝙼𝙰𝙶𝙴𝙽 𝙴𝚇𝚃𝚁𝙰Í𝙳𝙰 ⩍⩍\n── 𝚍𝚎 𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝 ──\n\n🖼 *Título:* ${title}\n🌐 *Usuario:* ${data.profile_name}`
      }, { quoted: m });
    } else {
      throw '✖️ No se encontró ni video ni imagen válida.';
    }
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al intentar descargar desde Pinterest.');
  }
};

handler.help = ['pinterestdl <url>'];
handler.tags = ['downloader'];
handler.command = ["pinterestdl", "pindl"];

export default handler;