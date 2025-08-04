import { promises as fs } from 'fs'
import { join } from 'path'

const DB_PATH = join(process.cwd(), './sorteo_db.json')

const deco1 = `
✿༻┊ Waguri Ai ⋆˚✿˖°
╰─➤
`.trim()

// Funciones para leer y escribir la "db" local
async function loadDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { participants: [] }
  }
}

async function saveDB(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

let handler = async (m, { args, conn }) => {
  const db = await loadDB()
  const participants = new Set(db.participants)
  const command = (args[0] || '').toLowerCase()

  if (command === 'join') {
    if (participants.has(m.sender)) {
      return m.reply(deco1 + '\nYa estás participando en el sorteo 🎉')
    }
    participants.add(m.sender)
    db.participants = Array.from(participants)
    await saveDB(db)
    return m.reply(deco1 + '\n¡Te has unido al sorteo! 🎉')
  }

  if (command === 'leave') {
    if (!participants.has(m.sender)) {
      return m.reply(deco1 + '\nNo estabas participando en el sorteo.')
    }
    participants.delete(m.sender)
    db.participants = Array.from(participants)
    await saveDB(db)
    return m.reply(deco1 + '\nHas salido del sorteo.')
  }

  if (command === 'draw') {
    if (participants.size === 0) return m.reply(deco1 + '\nNo hay participantes para sortear.')
    const winner = Array.from(participants)[Math.floor(Math.random() * participants.size)]
    db.participants = []
    await saveDB(db)
    return m.reply(deco1 + `\n🎉 ¡Felicidades! El ganador es:\n\n@${winner.split('@')[0]} 🎊`, null, { mentions: [winner] })
  }

  // Mensaje de ayuda
  return m.reply(deco1 + `
Comando de Sorteo Waguri Ai

Usa:
- ${handler.command} join  → para unirte al sorteo
- ${handler.command} leave → para salir del sorteo
- ${handler.command} draw → para seleccionar un ganador
`.trim())
}

handler.help = ['sorteo join|leave|draw']
handler.tags = ['fun']
handler.command = ['sorteo']
handler.private = false

export default handler