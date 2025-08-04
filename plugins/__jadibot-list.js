import { jidNormalizedUser } from "@adiwajshing/baileys"
import conexion from "../lib/jadibots.js"

let handler = async (m, { usedPrefix }) => {
  const sessions = [...conexion.conns.entries()]
  if (!sessions.length) return m.reply("☁︎ No hay subbots conectados actualmente.")

  const listado = sessions.map(([id, sock], i) => {
    const jid = sock.user?.jid || sock.user?.id || id
    const nombre = sock.user?.name || "Sin nombre"
    const numero = jidNormalizedUser(jid).split("@")[0]
    return `⛁ ${i + 1}. @${numero} ─ *${nombre}*\n✎ wa.me/${numero}?text=${usedPrefix}menu`
  }).join('\n\n')

  const texto = `
❀ *SubBots Activos ─ Waguri Ai* ❀

${listado}

☁︎ Total: ${sessions.length} subbots en línea.
`.trim()

  await m.reply(texto, null, {
    mentions: sessions.map(([id, sock]) => sock.user?.jid || sock.user?.id || id)
  })
}

handler.help = ["listjadibot"]
handler.tags = ["jadibot"]
handler.command = /^(list(jadi)?bot|(jadi)?botlist)$/i

export default handler