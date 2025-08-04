import yts from 'yt-search'
import fetch from 'node-fetch'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@adiwajshing/baileys'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const settings = global.db.data.settings[conn.user.jid] || {}
  if (!args[0]) return conn.reply(m.chat, `❀ 𝙴𝙹𝙴𝙼𝙿𝙻𝙾:\n➪ ${usedPrefix}${command} Joji - Ew`, m)

  await m.react('🔎')
  try {
    let query = args.join(" ")
    let searchResults = await searchVideos(query)
    let spotifyResults = await searchSpotify(query)
    let AppleMusicResult = await (await fetch(`https://api.siputzx.my.id/api/s/applemusic?query=${query}&region=es`)).json()
    AppleMusicResult = AppleMusicResult?.data?.result || []

    if (!searchResults.length && !spotifyResults.length) throw new Error('✖️ No se encontraron resultados.')

    let video = searchResults[0]

    let thumbnail
    try {
      thumbnail = await (await fetch(video.miniatura)).buffer()
    } catch (e) {
      console.warn('✖️ Miniatura no disponible, usando imagen por defecto.')
      thumbnail = await (await fetch('https://telegra.ph/file/36f2a1bd2aaf902e4d1ff.jpg')).buffer()
    }

    const caption = `
⩍⩍     𝙼𝚄𝚂𝙸𝙲 𝚂𝙴𝙻𝙴𝙲𝚃     ⃟🪷
──      𝖲𝗈𝗇𝗀 𝖣𝖺𝗍𝖺      ──

> 𝙏𝙞́𝙩𝙪𝙡𝙤: _${video.titulo || 'no encontrado'}_
> 𝘼𝙧𝙩𝙞𝙨𝙩𝙖: _${video.canal || 'no encontrado'}_
> 𝘿𝙪𝙧𝙖𝙘𝙞𝙤́𝙣: _${video.duracion || 'no encontrado'}_

ₚₑ𝖽ᵢ𝖽ₒ ₚₒᵣ: @${m.sender.split('@')[0]}
𝙻𝙸𝙽𝙺: ${video.url}

──────     ◌     ──────
${settings.wm}`

    let ytSections = searchResults.slice(1, 11).map((v, index) => ({
      title: `⋆ ${index + 1}. ${v.titulo}`,
      rows: [
        {
          title: `🎶 ⟡ 𝙰𝚞𝚍𝚒𝚘 (MP3)`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}play3 ${v.url}`
        },
        {
          title: `📦 ⟡ 𝙼𝙿𝟹 Documento`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}ytmp3doc ${v.url}`
        },
        {
          title: `🎥 ⟡ 𝚅𝚒𝚍𝚎𝚘 (MP4)`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}ytmp4 ${v.url}`
        },
        {
          title: `📦 ⟡ 𝙼𝙿𝟺 Documento`,
          description: `Duración: ${v.duracion || 'No disponible'}`,
          id: `${usedPrefix}ytmp4doc ${v.url}`
        }
      ]
    }))

    let spotifySections = spotifyResults.slice(0, 10).map((s, index) => ({
      title: `⋆ ${index + 1}. ${s.titulo}`,
      rows: [
        {
          title: `🎶 ⟡ 𝚂𝚙𝚘𝚝𝚒𝚏𝚢 𝙰𝚞𝚍𝚒𝚘`,
          description: `Duración: ${s.duracion || 'No disponible'}`,
          id: `${usedPrefix}spotify ${s.url}`
        }
      ]
    }))

    let applemusicSections = AppleMusicResult.slice(0, 5).map((a, index) => ({
      title: `⋆ ${index + 1}. ${a.title}`,
      rows: [
        {
          title: `🎶 ⟡ 𝙰𝚙𝚙𝚕𝚎 𝙰𝚞𝚍𝚒𝚘`,
          description: `Artista: ${a.artist || 'No disponible'}`,
          id: `${usedPrefix}applemusic ${a.link}`
        }
      ]
    }))

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: caption,
      footer: settings.wm,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      },
      buttons: [
        {
          buttonId: `${usedPrefix}ytmp3v2 ${video.url}`,
          buttonText: { displayText: '🎧 Descargar 𝖠𝗎𝖽𝗂𝗈' },
          type: 1,
        },
        {
          buttonId: `${usedPrefix}ytmp4v2 ${video.url}`,
          buttonText: { displayText: '🎬 Descargar 𝖵𝗂𝖽𝖾𝗈' },
          type: 1,
        },
        {
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '𝖸𝗈𝗎𝖳𝗎𝖻𝖾 🎵',
              sections: ytSections,
            }),
          },
        },
        {
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '𝖲𝗉𝗈𝗍𝗂𝖿𝗒 🎧',
              sections: spotifySections,
            }),
          },
        },
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
    conn.reply(m.chat, '*`Error al buscar el video.`*', m)
  }
}

handler.help = ['play *<texto>*']
handler.tags = ['downloader']
handler.command = ['play']
export default handler

async function searchVideos(query) {
  try {
    const res = await yts(query)
    return res.videos.slice(0, 10).map(video => ({
      titulo: video.title,
      url: video.url,
      miniatura: video.thumbnail,
      canal: video.author.name,
      publicado: video.timestamp || 'No disponible',
      vistas: video.views || 'No disponible',
      duracion: video.duration?.timestamp || 'No disponible'
    }))
  } catch (error) {
    console.error('Error en yt-search:', error.message)
    return []
  }
}

async function searchSpotify(query) {
  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    return data.data.slice(0, 10).map(track => ({
      titulo: track.title,
      url: track.url,
      duracion: track.duration || 'No disponible'
    }))
  } catch (error) {
    console.error('Error en Spotify API:', error.message)
    return []
  }
}