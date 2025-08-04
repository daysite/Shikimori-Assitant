import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw m.reply(`✧ Ejemplo: ${usedPrefix}${command} Joji - Ew`);

 await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})

    let results = await yts(text);
    let tes = results.videos[0]

  const args = text.split(' ');
  const videoUrl = args[0];
  
  const apiUrl = `https://www.apis-anomaki.zone.id/downloader/yta?url=${encodeURIComponent(tes.url)}`;

  try {
    const respuesta = await fetch(apiUrl);
    const keni = await respuesta.json()
    const { downloadURL } = keni.result.data;

    if (!downloadURL) throw m.reply('No hay respuesta de la api.');


    const caption = `
      *💮 PLAY AUDIO 💮*
 
  ✧ : \`titulo;\` ${tes.title || 'no encontrado'}
  ✧ : \`artista;\` ${tes.author.name || 'no encontrado'}
  ✧ : \`duracion;\` ${tes.duration || 'no encontrado'}
 
> ${wm}
> Pedido de @${m.sender.split('@')[0]}
> url: ${tes.url}`;

await m.reply(caption)

    await conn.sendMessage(m.chat, {
      audio: { url: downloadURL },
      mimetype: "audio/mp4",
      fileName: tes.title,
      mentions: [m.sender]
    }, { quoted: m });
await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})

  } catch (error) {
    console.error(`Error: ${error.message}`);
    await conn.sendMessage(m.chat, { react: { text: '❎', key: m.key }})
  }
};

handler.help = ['play2 *<consulta>*'];
handler.tags = ['downloader'];
handler.command = /^(play2|song2|musica2)$/i;

handler.register = true
handler.disable = false

export default handler