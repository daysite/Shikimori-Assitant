import axios from 'axios'
import FormData from 'form-data'

async function Uguu(buffer, filename) {
    try {
        const form = new FormData()
        form.append('files[]', buffer, { filename })

        const { data } = await axios.post('https://uguu.se/upload.php', form, {
            headers: form.getHeaders(),
        })

        if (data.files && data.files[0]) {
            return {
                name: data.files[0].name,
                url: data.files[0].url,
                size: data.files[0].size,
            }
        } else {
            throw new Error('Error al subir el archivo.')
        }
    } catch (err) {
        throw `${err.message}`
    }
}

async function Image2Comic(imageUrl) {
    try {
        const imageRes = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        const imageBuffer = Buffer.from(imageRes.data)

        const form = new FormData()
        form.append('hidden_image_width', '1712')
        form.append('hidden_image_height', '2560')
        form.append('upload_file', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        })
        form.append('brightness', '50')
        form.append('line_size', '2')
        form.append('screentone', 'true')

        const id = Math.random().toString(36).substring(2, 15)
        const uploadUrl = `https://tech-lagoon.com/canvas/image-to-comic?id=${id}&new_file=true`

        const uploadRes = await axios.post(uploadUrl, form, {
            headers: {
                ...form.getHeaders(),
                'origin': 'https://tech-lagoon.com',
                'referer': 'https://tech-lagoon.com/imagechef/en/image-to-comic.html',
                'x-requested-with': 'XMLHttpRequest',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            },
        })

        if (!Array.isArray(uploadRes.data)) {
            throw new Error('No se pudo obtener el resultado')
        }

        const [resId, filename] = uploadRes.data
        const n = Math.floor(Math.random() * 9000 + 1000)

        return `https://tech-lagoon.com/imagechef/image-to-comic/${resId}?n=${n}`

    } catch (err) {
        throw err
    }
}

let handler = async (m, { conn }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ''

        if (!mime.startsWith('image/')) return m.reply('¿Dónde está la imagen?')

        m.reply('Esperando...')

        const buffer = await q.download()
        const { url } = await Uguu(buffer, 'image.jpg')
        const resultado = await Image2Comic(url)

        await conn.sendMessage(m.chat, { image: { url: resultado } }, { quoted: m })

    } catch (e) {
        m.reply(e.message)
    }
}

handler.help = ['tocomic']
handler.command = ['tocomic']
handler.tags = ['ai']

export default handler