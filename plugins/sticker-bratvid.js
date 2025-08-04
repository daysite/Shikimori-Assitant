import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, command, usedPrefix }) => {
  if (!text) return m.reply(`✧ Ejemplo: ${usedPrefix + command} Keis Ai es supremo`);

  await conn.sendMessage(m.chat, { react: { text: '🎬', key: m.key } });

  try {
    const api = `https://zenzxz.dpdns.org/maker/bratvid?text=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    const buffer = await res.buffer();

    await conn.sendMessage(m.chat, {
      sticker: buffer,
      mimetype: 'video/mp4',
      packname: '👑 Keis Ai',
      author: '☯️ Brat Vid Generator'
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply('❌ No se pudo generar el Brat Vid. Intenta de nuevo más tarde.');
  }
};

handler.command = /^bratvid$/i;
handler.help = ['bratvid <texto>'];
handler.tags = ['maker'];

export default handler;