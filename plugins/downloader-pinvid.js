import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`⚠️ Ingresa el enlace de un video de Pinterest.\n\nEjemplo:\n${usedPrefix + command} https://pin.it/5nBeakRXD`)
  }

  const url = args[0]
  if (!url.match(/^https?:\/\/(www\.)?pin(it|terest)\.([a-z]{2,})\//)) {
    return m.reply('🔗 El enlace proporcionado no parece ser válido de Pinterest.')
  }

  try {
    const api = `https://api.nekorinn.my.id/downloader/pinterest?url=${encodeURIComponent(url)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.status || !json.result?.medias?.length) {
      throw '❌ No se pudo obtener el video de Pinterest.'
    }

    // Buscar el primer archivo que sea video y tenga extensión mp4
    const video = json.result.medias.find(v => v.extension === 'mp4')

    if (!video) {
      return m.reply('⚠️ No se encontró ningún video en este enlace de Pinterest.')
    }

    const caption = `🎬 *Pinterest Video Descargado*\n📦 Calidad: ${video.quality || 'Desconocida'}\n📁 Tamaño: ${video.formattedSize || '-'}\n📎 Fuente: Pinterest\n\nBot: *Keis Ai*`
    await conn.sendFile(m.chat, video.url, 'video.mp4', caption, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al procesar el video. Asegúrate de que el enlace sea correcto.')
  }
}

handler.command = /^pinvid$/i
handler.tags = ['downloader']
handler.help = ['pinvid <link>']
handler.premium = false
handler.register = true
handler.limit = true

export default handler