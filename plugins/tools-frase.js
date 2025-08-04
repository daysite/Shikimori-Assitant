import fetch from "node-fetch"
import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
const getBuffer = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error("Error al obtener el buffer", error);
    throw new Error("Error al obtener el buffer");
  }
}

    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
    const mentionRegex = new RegExp(`@${who.split('@')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
    let name = global.db.data.users[who]?.name || 'Usuario';
    let bufferpp = await await (await fetch(pp)).buffer()
//    const { files } = await uploadUguu(bufferpp)

    if (!text) {
        return m.reply(`📌 Ejemplo: .${command} Hola Mundo`)
    }
    await conn.sendMessage(m.chat, {image: {url: `https://fastrestapis.fasturl.cloud/maker/quote?text=${text}&username=${name}&ppUrl=https://images.unsplash.com/photo-1548386135-9002f96a0dc4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcG8lMjBkZSUyMGZsb3Jlc3xlbnwwfHwwfHx8MA%3D%3D&signature=%40${name}`}}, {quoted: m}); 
};

handler.help = ['frase'];
handler.tags = ['tools'];
handler.command = /^(frase)$/i;

export default handler;

async function uploadUguu(path) {
  try {
    const form = new FormData()
    form.append("files[]", fs.createReadStream(path))   
    const res = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      headers: form.getHeaders(),
      body: form
    })    
    const json = await res.json()
    await fs.promises.unlink(path)   
    return json
  } catch (e) {
    await fs.promises.unlink(path)
    throw "Error"
  }
}