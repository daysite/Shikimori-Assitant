import { createHash } from 'crypto'
const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = (await import('@adiwajshing/baileys')).default

let Reg = /^([a-zA-Z\s]+)\.(\d+)$/i  // Nombre solo letras y edad solo números

let handler = async function (m, { text, usedPrefix, conn }) {


const settings = global.db.data.settings[conn.user.jid] || {}

var link_img = settings.botIcon || `https://files.catbox.moe/ebpl7z.jpg`
    let user = global.db.data.users[m.sender]
    let nombre = conn.getName(m.sender)
        // Crear un número de serie único
    let sn = createHash('md5').update(m.sender).digest('hex')
    let bbbkeni = `.reg ${nombre}.18` // Registro Automático

    // Verificación de si el usuario ya está registrado
    if (user.registered === true) {
        throw conn.sendMessage(m.chat, {
         text: `✧ Usted ya está registradx\nQuiere salir del registro? ${usedPrefix}unreg <NUMERO DE SERIE>`,
         footer: wm,
         buttons: [
            {
                buttonId: `.unreg ${sn}`,  // El botón para el registro automático 
                buttonText: { displayText: '✧ Ya no quiero estar registradx' },
                type: 1
            }
        ],
        headerType: 1,
        viewOnce: true
        }, { quoted: m })
    }

    // Verificación del formato
    if (!Reg.test(text)) {
        return conn.sendMessage(m.chat, {
         text: `🍭 Formato incorrecto. Usa el formato: *${usedPrefix}reg Nombre.Edad*`,
         footer: wm,
         buttons: [
            {
                buttonId: bbbkeni,  // El botón para el registro automático 
                buttonText: { displayText: 'Registro Automático' },
                type: 1
            }
        ],
        headerType: 1,
        viewOnce: true
        }, { quoted: m })
    }

    let [_, name, age] = text.match(Reg)

    // Validaciones de nombre y edad
    if (!name) throw m.reply('🍭 Solo puedes poner letras en tu nombre')
    if (!age) throw m.reply('🍭 Solo puedes poner números en tu edad')

    age = parseInt(age)
    if (isNaN(age)) throw m.reply('🍭 La edad debe ser un número.');
    if (age > 120) throw m.reply('🍭 Usted es demasiado viejo')
    if (age < 16) throw m.reply('🍭 Usted es demasiado menor')

    // Registro del usuario
    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true

    // Crear un número de serie único
//    let sn = createHash('md5').update(m.sender).digest('hex')

    // Mensaje de registro
    let txt_reg = `
*\`REGISTRO COMPLETO\`*


 *👤 Nombre:* ${name}
 *📅 Edad:* ${age} Años 


*NUMERO DE SERIE*
${sn}

**Términos de servicio (TOS) - ${settings.botName} ESM**
Al utilizar *Shikimori* , usted acepta los siguientes términos:
1. *ESTÁ ESTRICTAMENTE PROHIBIDO CAMBIAR EL TEMPORIZADOR/MENSAJE TEMPORAL*
2. *NO ENVÍO DE MEDIOS NSFW*
3. *EL SPAM DE NÚMEROS DE BOT ESTÁ PROHIBIDO*
4. *PROPIETARIO DEL CHAT SI ES NECESARIO*

Registrarse significa aceptar los términos.
`

    // Creamos el mensaje con los botones interactivos al estilo que quieres
    await conn.sendMessage(m.chat, {
        image: { url: link_img },
        caption: txt_reg,
        footer: settings.wm,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        },
        buttons: [
            {
                buttonId: `${usedPrefix}menu`,  // El botón para ver el menú
                buttonText: { displayText: 'Menu' },
                type: 1
