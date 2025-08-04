/*
🔊 Función: Descargar audio de Instagram Reels
🌐 Fuente: https://saveinsta.to/
📦 Tipo: Plugin ESM
📢 Canal de origen: https://whatsapp.com/channel/0029Vb5blhMEawdx2QFALZ1d/385
*/

import fetch from 'node-fetch'
import axios from 'axios'
import qs from 'querystring'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`📌 *Ejemplo de uso:*\n${usedPrefix + command} https://www.instagram.com/reels/audio/183824252336459/`);

  let url = args[0];
  if (!/^https?:\/\/(www\.)?instagram\.com\/reels\/audio\/\d+/.test(url)) {
    return m.reply('❌ La URL de audio de Reels de Instagram no es válida.');
  }

  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Obtener token de la página principal
    const home = await axios.get('https://saveinsta.to/');
    const k_token = home.data.match(/k_token\s*=\s*['"]([^'"]+)['"]/)?.[1];
    if (!k_token) throw '❌ No se pudo obtener el token inicial.';

    // Verificación del usuario
    const verifyRes = await axios.post('https://saveinsta.to/api/userverify', qs.stringify({ url }), { headers });
    const cftoken = verifyRes.data?.token;
    if (!cftoken) throw '❌ Token de verificación no encontrado.';

    // Crear payload para la búsqueda
    const payload = qs.stringify({
      k_exp: Math.floor(Date.now() / 1000) + 300,
      k_token,
      q: url,
      t: 'media',
      lang: 'es',
      v: 'v2',
      cftoken
    });

    const searchRes = await axios.post('https://saveinsta.to/api/ajaxSearch', payload, { headers });
    const html = searchRes.data?.data;
    if (!html) throw '❌ No se encontraron resultados para este audio.';

    // Extraer el link de descarga
    const rawLink = html.match(/<a href="([^"]+)"[^>]*title="Download Audio"/)?.[1];
    const filename = html.match(/"filename":"([^"]+\.mp4)"/)?.[1] || html.match(/\/([^\/?#]+\.mp4)/)?.[1];
    if (!rawLink) throw '❌ No se pudo encontrar el enlace de descarga del audio.';

    // Convertir a mp3 vía proxy externo
    const mp3Link = 'https://mp3.videodropper.app/api?url=' + encodeURIComponent(rawLink);

    await conn.sendMessage(m.chat, {
      audio: { url: mp3Link },
      mimetype: 'audio/mp4',
      fileName: filename || 'Instagram_Audio.mp4',
      ptt: false
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ *Error al intentar descargar el audio.*\n' + e);
  }
};

handler.help = ['instaaudio', 'igaudio'];
handler.tags = ['downloader'];
handler.command = /^(instaaudio|igaudio|instagramaudio)$/i;
handler.limit = true;

export default handler;