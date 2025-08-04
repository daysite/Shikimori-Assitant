import { promises as fs } from "fs"
import { join } from "path"
import { jidNormalizedUser } from "@adiwajshing/baileys"
import conexion, { authFolder } from "../lib/jadibots.js"

let handler = async (m, { conn, text, isOwner }) => {
  const parentConn = await conexion.conn

  const jid = text
    ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    : jidNormalizedUser(conn.user?.jid || conn.user?.id)

  if (!jid || jid === "@s.whatsapp.net")
    return m.reply('⚠︎ 𝙽𝚞́𝚖𝚎𝚛𝚘 𝚗𝚘 𝚟𝚊́𝚕𝚒𝚍𝚘.')

  const numberId = jid.split('@')[0]

  // Solo puede cerrar su propia sesión o el owner principal
  if (jid !== conn.user?.jid && !isOwner)
    return m.reply('⛔ 𝙴𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚜𝚘́𝚕𝚘 𝚙𝚞𝚎𝚍𝚎 𝚞𝚜𝚊𝚛𝚕𝚘 𝚎𝚕 *𝚘𝚠𝚗𝚎𝚛 𝚙𝚛𝚒𝚗𝚌𝚒𝚙𝚊𝚕*.')

  const session = conexion.conns.get(numberId)

  if (!session)
    return m.reply('☁︎ 𝙴𝚜𝚝𝚎 𝚜𝚞𝚋𝚋𝚘𝚝 𝚗𝚘 𝚎𝚜𝚝𝚊́ 𝚊𝚌𝚝𝚒𝚟𝚘.')

  await conn.reply(m.chat, `✧ 𝙳𝚎𝚜𝚌𝚘𝚗𝚎𝚌𝚝𝚊𝚗𝚍𝚘 𝚜𝚞𝚋𝚋𝚘𝚝: @${numberId}`, m, {
    mentions: [jid]
  })

  // Cerrar socket y borrar sesión
  await session.end()
  conexion.conns.delete(numberId)

  const sessionPath = join(authFolder, numberId)
  await fs.rm(sessionPath, { recursive: true, force: true }).catch(console.error)

  await conn.reply(m.chat, `❀ *𝚂𝚞𝚋𝚋𝚘𝚝 𝚍𝚎𝚜𝚌𝚘𝚗𝚎𝚌𝚝𝚊𝚍𝚘 𝚢 𝚎𝚕𝚒𝚖𝚒𝚗𝚊𝚍𝚘 𝚌𝚘𝚛𝚛𝚎𝚌𝚝𝚊𝚖𝚎𝚗𝚝𝚎.*`, m)
}

handler.help = ["stopjadibot"]
handler.tags = ["jadibot"]
handler.command = /^stop(jadi)?bot$/i

export default handler