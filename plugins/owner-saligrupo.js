let handler = async (m, { conn, args }) => {
  const id = args[0]
  if (!id) return m.reply('❌ ID del grupo no proporcionado.')

  try {
    await conn.groupLeave(id)
    m.reply(`✅ El bot ha salido del grupo:\n${id}`)
  } catch (e) {
    console.error(e)
    m.reply('❌ No se pudo salir del grupo.')
  }
}

handler.command = /^salirgrupo$/i
handler.tags = ['owner']
handler.help = ['salirgrupo <idgrupo>']
handler.rowner = true

export default handler