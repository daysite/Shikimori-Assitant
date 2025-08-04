import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'

const handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw m.reply(`✧ Ejemplo de uso: ${usedPrefix}${command} Joji - Ew`);

  const search = await (await fetch(`https://api.siputzx.my.id/api/s/applemusic?query=${text}&region=es`)).json();
  const { title, artist, image, link, } = search.data.result[0];

await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
//  await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: wait }, { quoted: m });

    const response = await (await fetch(`https://fastrestapis.fasturl.cloud/downup/applemusicdown?url=${encodeURIComponent(link)}`)).json();;
    const downloadUrl = response.result.downloadUrl;

    if (!downloadUrl) throw new Error('Audio URL not found');
    
 await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      caption: `*${title}*`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: link,
          title: title,
          body: 'Audio Download',
          sourceUrl: link,
          thumbnail: await (await conn.getFile(image)).data,
        },
      },
    }, { quoted: m })
};

handler.help = ['aplay'].map((v) => v + ' *<consulta>*');
handler.tags = ['downloader'];
handler.command = ['aplay'];

export default handler