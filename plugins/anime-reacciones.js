import fetch from 'node-fetch'
import GIFBufferToVideoBuffer from '../lib/Gifbuffer.js'

const getBuffer = async (url) => {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  return Buffer.from(buffer)
}

// Comandos mapeados para waifu.pics → español + decorado
const actions = {
  'bully':        { es: 'acosó a', deco: '(¬‿¬)' },
  'cuddle':       { es: 'abrazó a', deco: '(っ˘з(˘⌣˘ )' },
  'cry':          { es: 'lloró con', deco: '(っ´ω`c)' },
  'hug':          { es: 'abrazó a', deco: '(づ￣ ³￣)づ' },
  'awoo':         { es: 'hizo awoo para', deco: '꒰･‿･๑꒱' },
  'kiss':         { es: 'besó a', deco: '( ˘ ³˘)♥' },
  'lick':         { es: 'lamió a', deco: '(｡･ω･｡)' },
  'pat':          { es: 'acarició a', deco: '(＾ｖ＾)' },
  'smug':         { es: 'se mostró engreído con', deco: '(＾▽＾)' },
  'bonk':         { es: 'golpeó a', deco: '(╯°□°）╯︵ ┻━┻' },
  'yeet':         { es: 'lanzó a', deco: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧' },
  'blush':        { es: 'se sonrojó con', deco: '(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)' },
  'smile':        { es: 'sonrió a', deco: '(｡•̀ᴗ-)✧' },
  'wave':         { es: 'saludó a', deco: 'ヾ(＾∇＾)' },
  'highfive':     { es: 'chocó los cinco con', deco: '✋✋' },
  'handhold':     { es: 'sostuvo la mano de', deco: '(づ￣ ³￣)づ' },
  'bite':         { es: 'mordió a', deco: '≽^‿‿^≼' },
  'glomp':        { es: 'se lanzó sobre', deco: '≧◡≦' },
  'slap':         { es: 'abofeteó a', deco: '(҂⌣̀_⌣́)' },
  'kill':         { es: 'mató a', deco: '(×_×;）' },
  'happy':        { es: 'está feliz con', deco: '(´｡• ᵕ •｡`)' },
  'wink':         { es: 'guiñó a', deco: '(^_~)' },
  'poke':         { es: 'tocó a', deco: '( ° ᴗ°)~ð' },
  'dance':        { es: 'bailó con', deco: '♪┏(・o･)┛♪' },
  'cringe':       { es: 'sintió cringe por', deco: '(；￣Д￣)' }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  let waifuCommand = command.toLowerCase()
  if (!(waifuCommand in actions)) return m.reply('✧ Comando no reconocido.')

  let target = m.mentionedJid?.[0] || m.quoted?.sender
  if (!target) return m.reply(`✧ Debes etiquetar o responder a alguien\nEjemplo: *${usedPrefix + command} @usuario*`)

  const senderName = conn.getName(m.sender)
  const targetName = conn.getName(target)

  const apiUrl = `https://api.waifu.pics/sfw/${waifuCommand}`
  const res = await fetch(apiUrl)
  const json = await res.json()

  if (!json?.url) return m.reply('✧ No encontré una animación para eso.')

  const gifBuffer = await getBuffer(json.url)
  const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer)

  const { es: verbo, deco } = actions[waifuCommand]
  const caption = `✧ ${senderName} ${verbo} ${targetName}\n${deco}`

  await conn.sendMessage(
    m.chat,
    {
      video: videoBuffer,
      caption,
      gifPlayback: true,
      gifAttribution: 0
    },
    { quoted: m }
  )
}

handler.tags = ['fun', 'anime']
handler.help = Object.keys(actions).map(a => `${a} @usuario`)
handler.command = new RegExp(`^(${Object.keys(actions).join('|')})$`, 'i')
handler.group = true
handler.register = true

export default handler