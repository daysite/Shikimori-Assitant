import fetch from 'node-fetch'
import { FormData } from "formdata-node"
import { uploadPomf } from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        let name = await conn.getName(who)
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw m.reply('✧ Responde a una *Imagen*.')
        m.reply(wait)
        let media = await q.download()
        removeBackground(media)
        .then((result) => {
    conn.sendMessage(m.chat, {
      image: { url: result.result_url },
      caption: wm,
    }, { quoted: m });
  })
        .catch(err => console.log(err.message))
    } catch (error) {
        console.error(error)
        m.reply('Internal server error')
    }
}

handler.help = ['hd2']
handler.tags = ['ai']
handler.command = /^(hd2)$/i

handler.register = true
handler.limit = 3

export default handler

const removeBackground = async (imageBuffer) => {
    if (!imageBuffer?.length) throw Error (`mana file nya`)

    const body = new FormData()
    body.append("image", new Blob([imageBuffer]))
    body.append("scale", "2")

    const headers = {
        "accept": "application/json",
        "x-client-version": "web",
        ...body.headers
    }

    const response = await fetch("https://api2.pixelcut.app/image/upscale/v1", {
        headers, body, "method": "POST"
    })

    if(!response.ok) throw Error (`${response.status} ${response.statusText}\n${await response.text() || null}`)
    return await response.json()
}