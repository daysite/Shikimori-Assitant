import axios from 'axios'

const types = {
  genre: {
    pop: 'Pop', rock: 'Rock', folk: 'Folk', rap: 'Rap',
    rnb: 'R&B', jazz: 'Jazz', classical: 'Classical',
    electronic: 'Electronic', country: 'Country', blues: 'Blues'
  },
  mood: {
    happy: 'Happy', sad: 'Sad', romantic: 'Romantic', energetic: 'Energetic',
    peaceful: 'Peaceful', melancholic: 'Melancholic', angry: 'Angry',
    hopeful: 'Hopeful', nostalgic: 'Nostalgic', uplifting: 'Uplifting'
  },
  structure: {
    verse_chorus: 'Verse + Chorus',
    verse_chorus_bridge: 'Verse + Chorus + Bridge',
    verse_prechorus_chorus: 'Verse + Pre-Chorus + Chorus',
    verse_chorus_bridge_chorus: 'Verse + Chorus + Bridge + Chorus',
    verse_only: 'Verse Only',
    chorus_only: 'Chorus Only'
  },
  language: {
    en: 'English',
    es: 'Spanish'
  }
}

let handler = async (m, { args }) => {
  try {
    let [topic, genreKey, moodKey, structureKey, langInput] = args
    if (!topic || !genreKey || !moodKey || !structureKey || !langInput) {
      return m.reply(`Ejemplo : .lyricsgen Letra Género Estado de ánimo Estructura Idioma\n\n*Uso:* .lyricsgen Cinta rock melancholic verse_chorus es

Genero :
${Object.keys(types.genre).join(', ')}

Mood :
${Object.keys(types.mood).join(', ')}

Estructura :
${Object.keys(types.structure).join(', ')}

Idioma :
${Object.keys(types.language).join(', ')}`)
    }

    if (!types.genre[genreKey?.toLowerCase()]) return m.reply(`Género inválido.

Opciones de género :
${Object.keys(types.genre).join(', ')}`)

    if (!types.mood[moodKey?.toLowerCase()]) return m.reply(`Estado de ánimo inválido.

Opciones de estado de ánimo :
${Object.keys(types.mood).join(', ')}`)

    if (!types.structure[structureKey?.toLowerCase()]) return m.reply(`Estructura inválida.

Opciones de estructura :
${Object.keys(types.structure).join(', ')}`)

    if (!types.language[langInput?.toLowerCase()]) return m.reply(`Idioma inválido.

Opciones de idioma :
${Object.keys(types.language).join(', ')}`)

    let genre = genreKey.toLowerCase()
    let mood = moodKey.toLowerCase()
    let structure = structureKey.toLowerCase()
    let language = langInput.toLowerCase()

    let payload = {
      topic,
      style: genre,
      mood,
      structure: structure.replace(/_/g, '-'),
      language
    }

    let { data } = await axios.post('https://lyricsintosong.ai/api/generate-lyrics', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://lyricsintosong.ai',
        'Referer': 'https://lyricsintosong.ai/lyrics-generator',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    let { title = 'Untitled', lyrics } = data?.data || {}
    if (!lyrics) throw new Error('Letra no encontrada.')

    let text = `Título : ${title}
Tema : ${payload.topic}
Genero : ${types.genre[genre]}
Mood : ${types.mood[mood]}
Estructura : ${types.structure[structure]}
Idioma : ${types.language[language]}

${lyrics}`

    m.reply(text)
  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['lyricsgen <tema> <generi> <mood> <estructura> <idioma>']
handler.command = ['lyricsgen']
handler.tags = ['ai']

export default handler