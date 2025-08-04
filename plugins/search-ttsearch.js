import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✧ Ejemplo:\n${usedPrefix + command} waguri`);

  await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

  try {
    const res = await fetch(`https://zenzxz.dpdns.org/search/tiktok?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result?.no_watermark) {
      return m.reply('❌ No se encontró ningún resultado.');
    }

    const { title, no_watermark, music } = json.result;

    // Enviar el video
    await conn.sendMessage(m.chat, {
      video: { url: no_watermark },
      caption: `🎵 *Resultado TikTok:*\n\n📌 *Título:* ${title}\n\n🔍 *Consulta:* ${text}\n\n👑 Keis Ai`,
      mimetype: 'video/mp4'
    }, { quoted: m });

    // Enviar la música
    await conn.sendMessage(m.chat, {
      audio: { url: music },
      mimetype: 'audio/mp4',
      fileName: `${title}.mp3`,
      ptt: false  // Cambia a true si quieres que lo mande como nota de voz
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al buscar el TikTok. Intenta más tarde.');
  }
};

handler.command = /^ttsearch$/i;
handler.help = ['ttsearch <consulta>'];
handler.tags = ['downloader'];

export default handler;