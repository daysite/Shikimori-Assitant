import fetch from 'node-fetch'
import yts from 'yt-search'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn, text, usedPrefix, command }) => {
const settings = global.db.data.settings[conn.user.jid] || {}
  if (!text) return m.reply(`• *Ejemplo:* ${usedPrefix + command} elaina edit`)
  await m.reply('> _*Cargando resultados...*_')

  async function createImage(imgBuffer) {
    const { imageMessage } = await generateWAMessageContent({
      image: imgBuffer
    }, {
      upload: conn.waUploadToServer
    })
    return imageMessage
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const results = await yts(text)
  const videos = results.videos.slice(0, 6)
  shuffleArray(videos)

  const cards = []
  let i = 1

  for (let video of videos) {
    const imageRes = await fetch(video.thumbnail)
    const imgBuffer = await imageRes.buffer()

    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `🎬 *Título:* ${video.title}\n⌛ *Duración:* ${video.timestamp}\n👀 *Vistas:* ${video.views}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '乂 Y O U T U B E'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: `Video - ${i++}`,
        hasMediaAttachment: true,
        imageMessage: await createImage(imgBuffer)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: 'cta_url',
            buttonParamsJson: `{"display_text":"Mirar en YouTube","url":"${video.url}"}`
          },
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: "Copiar Link",
              copy_code: video.url
            })
          }
        ]
      })
    })
  }

  const message = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: "Resultados de la búsqueda completos..."
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: settings.wm
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, {})

  await conn.relayMessage(m.chat, message.message, { messageId: message.key.id })
}

handler.help = ["ytslide *<consulta>*", "yts *<consulta>*"]
handler.tags = ["search"]
handler.command = ["ytslide", "yts"]

export default handler