import { promises as fs, existsSync } from "fs"
import { join } from "path"
import { jidNormalizedUser } from "@adiwajshing/baileys"
import conexion, { authFolder } from "../lib/jadibots.js"

let handler = async (m, { conn, args }) => {
  const targetJid = m.mentionedJid?.[0] || m.sender
  const normalizedJid = jidNormalizedUser(targetJid)
  const userId = normalizedJid.split("@")[0]
  const sessionDir = join(authFolder, userId)

  if (!existsSync(sessionDir)) {
    return m.reply(`⚠︎ 𝙽𝚘 𝚎𝚡𝚒𝚜𝚝𝚎 𝚗𝚒𝚗𝚐𝚞𝚗𝚊 𝚜𝚎𝚜𝚒𝚘́𝚗 𝚊𝚌𝚝𝚒𝚟𝚊 𝚙𝚊𝚛𝚊: @${userId}`, { mentions: [normalizedJid] })
  }

  try {
    await fs.rm(sessionDir, { recursive: true, force: true })

    if (conexion.conns.has(userId)) {
      conexion.conns.delete(userId)
    }

    await conn.sendMessage(m.chat, {
      text: `❀ 𝚂𝚎𝚜𝚒𝚘́𝚗 𝚌𝚎𝚛𝚛𝚊𝚍𝚊 𝚌𝚘𝚗 𝚎́𝚡𝚒𝚝𝚘 para @${userId}\n✧ El subbot ha sido desconectado.`,
      mentions: [normalizedJid]
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    await m.react("✖️")
    await m.reply("✘ 𝙷𝚞𝚋𝚘 𝚞𝚗 𝚎𝚛𝚛𝚘𝚛 𝚊𝚕 𝚌𝚎𝚛𝚛𝚊𝚛 𝚕𝚊 𝚜𝚎𝚜𝚒𝚘́𝚗.")
  }
}

handler.tags = ["jadibot"]
handler.help = ["logout", "delsession", "cerrarsesion"]
handler.command = /^(deletesess?ion|eliminarsesion|borrarsesion|delsess?ion|cerrarsesion|delserbot|logout)$/i

export default handler