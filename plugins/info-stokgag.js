import fetch from 'node-fetch'

let handler = async (m) => {
  try {
    const res = await fetch('https://zenzxz.dpdns.org/info/growagardenstock')
    const json = await res.json()

    if (!json.status || !json.data?.data) {
      throw m.reply('No hay datos disponibles .')
    }

    const data = json.data.data

    const formatItems = (title, items) => {
      if (!items?.length) return ''
      let text = `\n*${title.toUpperCase()}*\n`
      for (const item of items) {
        text += `${item.name} = ${item.quantity}\n`
      }
      return text
    }

    const formatWeather = (w) => {
      return `\n*Clima actual*\nTipo : ${w.type}\nActivo : ${w.active ? 'si' : 'no'}`
    }

    const formatWeatherHistory = (history) => {
      if (!history?.length) return ''
      let text = `\n*Historial del clima*\n`
      for (const w of history) {
        text += `${w.type} (${w.active ? 'activo' : 'no activo'})\n`
      }
      return text
    }

    let output = '*Stok de Grow a garden :*\n'
    output += formatItems('Semillas', data.seeds)
    output += formatItems('Herramientas', data.gear)
    output += formatItems('Huevos', data.eggs)
    output += formatItems('Cosmeticos', data.cosmetics)
    output += formatItems('Miel', data.honey)
    output += formatWeather(data.weather)
    output += formatWeatherHistory(data.weatherHistory)

    output += `\n\nUltima Actualización : ${new Date(data.lastGlobalUpdate).toLocaleString('es-ES')}`

    m.reply(output.trim())
  } catch (e) {
    m.reply('Ups hermano, no se pudieron recuperar los datos de Grow A Garden, intenta verificar la API')
    console.error(e)
  }
}

handler.help = ['stokgag']
handler.tags = ['info']
handler.command = ['stokgag']

export default handler