import { promises as fs, existsSync } from "fs"
import { join } from "path"
import conexion, { authFolder } from "../lib/jadibots.js"

let handler = async (m, { conn, isOwner }) => {
  let folders
  try {
    folders = await fs.readdir(authFolder)
  } catch (e) {
    console.error(e)
    return m.reply("⚠︎ No se pudo acceder a la carpeta de sesiones.")
  }

  // Filtrar y excluir carpeta 'parent'
  folders = folders.filter(dir => dir !== "parent")

  if (folders.length === 0)
    return m.reply("☁︎ No hay subbots activos para limpiar.")

  let count = 0
  for (const folder of folders) {
    const sessionId = folder
    const sessionPath = join(authFolder, folder)

    try {
      // Si está activo, cerrarlo
      const socket = conexion.conns.get(sessionId)
      if (socket?.end) {
        await socket.end()
        conexion.conns.delete(sessionId)
      }

      // Borrar la carpeta de sesión
      if (existsSync(sessionPath)) {
        await fs.rm(sessionPath, { recursive: true, force: true })
        count++
      }
    } catch (e) {
      console.error(`✖ Error al limpiar ${sessionId}:`, e)
    }
  }

  await conn.reply(m.chat, `❀ *${count} subbots eliminados exitosamente.*\n✧ Todas las sesiones han sido cerradas y eliminadas.`, m)
}

handler.help = ["clearsessions", "clearsubbots"]
handler.tags = ["jadibot"]
handler.command = /^clear(sessions|subbots)$/i
handler.rowner = true // Solo Loner (real owner)

export default handler