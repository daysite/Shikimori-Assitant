import fetch from 'node-fetch'
import { proto } from '@whiskeysockets/baileys'

const availableVoices = [
  { name: 'Hatsune Miku', model: 'miku' },
  { name: 'Nahida', model: 'nahida' },
  { name: 'Nami', model: 'nami' },
  { name: 'Ana (Female)', model: 'ana' },
  { name: 'Optimus Prime', model: 'optimus_prime' },
  { name: 'Goku', model: 'goku' },
  { name: 'Taylor Swift', model: 'taylor_swift' }
]

const ttsApi = 'https://zenzxz.dpdns.org/tools/tts?text='

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
  const userText = text?.trim()

  if (!userText)
    return m.reply(`🔊 *Convierte texto en voz de personaje*\n\n📌 Uso:\n${usedPrefix + command} <texto>\n\n🧪 Ejemplo:\n${usedPrefix + command} Hola, soy tu bot.`)

  const listSections = [{
    title: '🎙️ Selecciona una voz',
    rows: availableVoices.map(voice => ({
      title: voice.name,
      description: `Generar con voz de ${voice.name}`,
      rowId: `${usedPrefix}ttszenzvoice ${voice.model}|${userText}`
    }))
  }]

  const listMessage = {
    text: `🎤 Texto detectado: *${userText}*\n\nSelecciona una voz para continuar:`,
    footer: 'Keis Ai - TTS personalizado por ZenzzXD',
    title: '🧠 Conversor de texto a voz',
    buttonText: 'Seleccionar voz',
    sections: listSections
  }

  await conn.sendMessage(m.chat, listMessage, { quoted: m })
}

handler.command = /^ttszenzmenu$/i
handler.help = ['ttszenzmenu <texto>']
handler.tags = ['tools', 'audio']

export default handler