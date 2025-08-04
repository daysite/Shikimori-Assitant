import fetch from "node-fetch"
import * as cheerio from "cheerio"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const inputText = args.length
    ? args.join(" ")
    : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null
  if (!inputText) return await m.reply("¡Por favor ingrese el texto para generar la imagen, el texto debe de estar en ingles!")

  await m.reply(wait)

  let answer

  switch (command) {
    case "regemflux":
      answer = await flux(inputText)
      if (answer) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: answer },
            caption: `✨ *\`Generador de Imagenes\`* ✨\n\n📝 *Descripción:* ${inputText}`,
            mentions: [m.sender],
          },
          { quoted: m }
        )
      } else {
        await m.reply("No se pudo producir la imagen, inténtelo de nuevo.")
      }
      break

    case "regemwriter":
      answer = await writer(inputText)
      if (answer) await m.reply(answer)
      else await m.reply("Error al reescribir, inténtalo de nuevo.")
      break

    case "regemrephrase":
      answer = await rephrase(inputText)
      if (answer) await m.reply(answer)
      else await m.reply("Error al parafrasear, inténtalo de nuevo.")
      break

    default:
      throw new Error(`Comando desconocido: ${command}`)
  }
}

handler.help = ["regemflux", "regemwriter", "regemrephrase"]
handler.tags = ["ai"]
handler.command = /^(regemflux|regemwriter|regemrephrase)$/i

export default handler

const flux = async (prompt) => {
  const url = `https://lusion.regem.in/access/flux.php?prompt=${encodeURIComponent(prompt)}`
  const headers = {
    Accept: "*/*",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
    Referer: "https://lusion.regem.in/?ref=taaft&utm_source=taaft&utm_medium=referral",
  }
  const response = await fetch(url, { headers })
  const html = await response.text()
  const $ = cheerio.load(html)
  return $("a.btn-navy.btn-sm.mt-2").attr("href") || null
}

const writer = async (input) => {
  const url = `https://ai-server.regem.in/api/index.php`
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "*/*",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
    Referer: "https://regem.in/ai-writer/",
  }
  const formData = new URLSearchParams()
  formData.append("input", input)
  const response = await fetch(url, { method: "POST", headers, body: formData })
  return response.text()
}

const rephrase = async (input) => {
  const url = `https://ai-server.regem.in/api/rephrase.php`
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "*/*",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
    Referer: "https://regem.in/ai-rephrase-tool/",
  }
  const formData = new URLSearchParams()
  formData.append("input", input)
  const response = await fetch(url, { method: "POST", headers, body: formData })
  return response.text()
}