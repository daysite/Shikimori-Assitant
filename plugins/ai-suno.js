import axios from 'axios'
import crypto from 'crypto'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const prompt = args.join(' ')
  if (!prompt) {
    return conn.reply(m.chat, `╭━〔 *🌸 Generador de Canciones AI* 〕━⬣
┃ ✿ ᝰ︙Escribe el tema o idea para generar tu canción.
┃ 
┃ Ejemplo:
┃ ${usedPrefix + command} canción lofi sobre amor imposible
╰━━━━━━━━━━━━━━━━━━⬣`, m)
  }

  try {
    const { data: cf } = await axios.get('https://api.nekorinn.my.id/tools/rynn-stuff', {
      params: {
        mode: 'turnstile-min',
        siteKey: '0x4AAAAAAAgeJUEUvYlF2CzO',
        url: 'https://songgenerator.io/features/s-45',
        accessKey: '2c9247ce8044d5f87af608a244e10c94c5563b665e5f32a4bb2b2ad17613c1fc'
      }
    })

    const uid = crypto.createHash('md5').update(Date.now().toString()).digest('hex')

    const { data: task } = await axios.post('https://aiarticle.erweima.ai/api/v1/secondary-page/api/create', {
      prompt,
      channel: 'MUSIC',
      id: 1631,
      type: 'features',
      source: 'songgenerator.io',
      style: '',
      title: '',
      customMode: false,
      instrumental: false
    }, {
      headers: {
        uniqueid: uid,
        verify: cf.result.token
      }
    })

    let attempts = 0
    const maxAttempts = 60

    while (attempts < maxAttempts) {
      const { data } = await axios.get(`https://aiarticle.erweima.ai/api/v1/secondary-page/api/${task.data.recordId}`, {
        headers: {
          uniqueid: uid,
          verify: cf.result.token
        }
      })

      if (data?.data?.state === 'success') {
        const result = JSON.parse(data.data.completeData)

        return conn.reply(m.chat, `╭─〔 *ꕥ Waguri Music AI* 〕─⬣
│ ✿ *Descripción:* ${prompt}
│ ✿ *Estilo:* ${result.musicStyle || 'Desconocido'}
│ ✿ *Voz:* ${result.voice || 'Desconocida'}
│ ✿ *Instrumental:* ${result.instrumental ? 'Sí' : 'No'}
│
│ 🎧 *Escuchar:* ${result.musicUrl}
╰──────────────⬣`, m)
      }

      await new Promise(res => setTimeout(res, 1000))
      attempts++
    }

    throw new Error('⏳ La canción está tardando demasiado en generarse. Intenta de nuevo más tarde.')

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, `❌ Error al generar la canción:\n${err.message}`, m)
  }
}

handler.command = ['wagurising', 'suno', 'genmusic']
handler.help = ['wagurising <texto>']
handler.tags = ['ai']
handler.premium = false
handler.register = true

export default handler