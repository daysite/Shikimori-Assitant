import qrcode from 'qrcode'
import { join } from 'path'
import { existsSync, promises as fs } from 'fs'
import {
  delay,
  DisconnectReason,
  areJidsSameUser,
  jidNormalizedUser,
  useMultiFileAuthState
} from '@adiwajshing/baileys'
import conexion, { start, reload, authFolder as sessionPath } from './jadibots.js'

const captionPairing = `
✿ 𝙲𝚘́𝚍𝚒𝚐𝚘 𝚍𝚎 𝚅𝚒𝚗𝚌𝚞𝚕𝚊𝚌𝚒𝚘́𝚗
➪  %code
`.trim()

const captionQR = `
✿ 𝚂𝚌𝚊𝚗𝚎𝚊 𝚎𝚕 𝙲𝙾𝙳𝙸𝙶𝙾 𝚀𝚁 𝚙𝚊𝚛𝚊 𝚌𝚘𝚗𝚟𝚎𝚛𝚝𝚒𝚛𝚝𝚎 𝚎𝚗 𝚋𝚘𝚝 𝚝𝚎𝚖𝚙𝚘𝚛𝚊𝚕.
𖹭 𝙴𝚜 𝚟𝚊́𝚕𝚒𝚍𝚘 𝚙𝚘𝚛 *%time* segundos.
QR Usado: %count / 3
`.trim()

export async function Jadibot(jidUser, parentConn = conexion.conn, msg = null, usePairing = false) {
  jidUser = jidNormalizedUser(jidUser)
  const numberId = jidUser.split('@')[0]
  const folder = join(sessionPath, numberId)

  const alreadyConnected = [...conexion.conns.values()].some(bot => bot.user?.jid === jidUser)
  if (alreadyConnected) throw new Error('✧ Este subbot ya está activo.')

  const auth = await useMultiFileAuthState(folder)
  const sock = await start(null, {
    authState: auth,
    isChild: true,
    usePairingCode: usePairing
  })

  const reply = (...args) => parentConn?.reply(...args) || console.log(...args)
  let qrCount = 0
  let qrSentMsg

  if (usePairing && !sock.authState.creds.registered) {
    await delay(1500)
    try {
      let code = await sock.requestPairingCode(numberId)
      code = code.match(/.{1,4}/g)?.join('-') || code
      if (msg) {
        await reply(msg.chat, captionPairing.replace('%code', code), msg)
        await reply(msg.chat, code, msg)
      }
    } catch (err) {
      throw new Error('❌ Fallo al solicitar el código de vinculación.')
    }
  }

  sock.ev.on('connection.update', async update => {
    const { qr, connection, lastDisconnect, isNewLogin } = update

    if (qr && !usePairing && msg) {
      if (qrCount >= 3) {
        await reply(msg.chat, '✧ Código QR expirado.', msg)
        sock.ev.removeAllListeners()
        if (existsSync(folder)) await fs.rm(folder, { recursive: true }).catch(console.error)
        return
      }

      qrCount++
      try {
        if (qrSentMsg?.key) await parentConn.sendMessage(msg.chat, { delete: qrSentMsg.key })

        const qrImage = await qrcode.toBuffer(qr, { width: 256 })
        qrSentMsg = await parentConn.sendFile(
          msg.chat,
          qrImage,
          'qr.png',
          captionQR.replace('%time', sock?.ws?.config?.qrTimeout / 1000 || 20).replace('%count', qrCount),
          msg
        )
      } catch (err) {
        console.error('Error al generar el QR:', err)
      }
    }

    const statusCode =
      lastDisconnect?.error?.output?.statusCode ||
      lastDisconnect?.error?.output?.payload?.statusCode

    const statusReason =
      DisconnectReason[statusCode] || 'Motivo desconocido'

    if (connection === 'close') {
      if ([DisconnectReason.loggedOut, DisconnectReason.connectionReplaced, DisconnectReason.timedOut, DisconnectReason.forbidden].includes(statusCode)) {
        if (existsSync(folder)) await fs.rm(folder, { recursive: true }).catch(console.error)
        conexion.conns.delete(numberId)

        if (statusCode === DisconnectReason.loggedOut)
          await reply(msg.chat, '✧ Sesión cerrada correctamente.', msg)
        else if (statusCode === DisconnectReason.forbidden)
          await reply(msg.chat, '✧ El número fue bloqueado. Sesión eliminada.', msg)
        return
      } else {
        await reload(sock, true, {
          authState: auth,
          isChild: true,
          usePairingCode: usePairing
        }).catch(console.error)
      }
    }

    if (isNewLogin) {
      sock.logger.info(`⛁ Subbot ${numberId} iniciado.`)
      if (msg) {
        const confirm = await msg.reply('❀ Conexión exitosa. ¡Subbot activo!')
        await delay(1000)
        await sock.reply(msg.chat, '✧ Puedes empezar a usar tu subbot.', confirm)
      }
    }
  })

  await waitFor(() => sock?.user?.jid)
  conexion.conns.set(numberId, sock)
  return sock
}

export async function restoreSession(parent = null) {
  const folders = await fs.readdir(sessionPath)

  for (const folder of folders) {
    if (/parent/.test(folder)) continue
    const creds = join(sessionPath, folder, 'creds.json')
    if (!existsSync(creds)) continue
    if (conexion.conns.has(folder)) continue
    await Jadibot(`${folder}@s.whatsapp.net`, parent)
  }

  console.log(`✧ Restauración completada. Subbots activos: ${conexion.conns.size}`)
}

function waitFor(conditionFn) {
  return new Promise(resolve => {
    const loop = () => conditionFn() ? resolve() : setTimeout(loop, 500)
    loop()
  })
}

export default Jadibot