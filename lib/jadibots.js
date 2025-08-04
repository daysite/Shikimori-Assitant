import {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@adiwajshing/baileys'

import pino from 'pino'
import chalk from 'chalk'
import { join, resolve } from 'path'
import { makeWASocket } from './simple.js'

// Configuración inicial
export let conn = null
export let conns = new Map()
export const authFolder = 'sessions/'
export const authState = await useMultiFileAuthState(join(authFolder, 'parent'))
export const logger = pino({ level: 'silent' })

// Iniciar socket principal o subbot
export async function start(existingConn = null, options = { authState, isChild: false, usePairingCode: false }) {
  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`✧ Usando WhatsApp v${version.join('.')} (Última: ${isLatest})`)

  const socketConfig = {
    version,
    logger,
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: !(options.usePairingCode || options.isChild),
    qrTimeout: 20000,
    auth: {
      creds: options.authState.state.creds,
      keys: makeCacheableSignalKeyStore(options.authState.state.keys, logger.child({ stream: 'store' }))
    }
  }

  const sock = makeWASocket(socketConfig, {
    ...(existingConn?.chats ? { chats: existingConn.chats } : {})
  })

  sock.isInit = existingConn?.isInit ?? false
  sock.isReloadInit = existingConn?.isReloadInit ?? true

  await reload(sock, false, options).catch(console.error)
  return sock
}

// Recargar conexión de un socket
let oldHandler = null
export async function reload(sock, force = false, options = { authState, isChild: false, usePairingCode: false }) {
  if (!options.handler) options.handler = await importFile('./handler.js')
  if (options.handler instanceof Promise) options.handler = await options.handler
  if (!options.handler && oldHandler) options.handler = oldHandler
  oldHandler = options.handler

  const isFirstInit = !!sock.isReloadInit

  if (force) {
    console.log('✧ Reiniciando conexión...')
    try { sock.ws.close() } catch {}
    sock.ev.removeAllListeners()
    Object.assign(sock, await start(sock, options) || {})
  }

  Object.assign(sock, defaultMessages())

  if (!isFirstInit) {
    if (sock.credsUpdate) sock.ev.off('creds.update', sock.credsUpdate)
    if (sock.handler) sock.ev.off('messages.upsert', sock.handler)
    if (sock.participantsUpdate) sock.ev.off('group-participants.update', sock.participantsUpdate)
    if (sock.groupsUpdate) sock.ev.off('groups.update', sock.groupsUpdate)
    if (sock.onDelete) sock.ev.off('message.delete', sock.onDelete)
    if (sock.connectionUpdate) sock.ev.off('connection.update', sock.connectionUpdate)
  }

  if (options.handler) {
    if (options.handler.handler) sock.handler = options.handler.handler.bind(sock)
    if (options.handler.participantsUpdate) sock.participantsUpdate = options.handler.participantsUpdate.bind(sock)
    if (options.handler.groupsUpdate) sock.groupsUpdate = options.handler.groupsUpdate.bind(sock)
    if (options.handler.deleteUpdate) sock.onDelete = options.handler.deleteUpdate.bind(sock)
  }

  if (!options.isChild) sock.connectionUpdate = connectionUpdate.bind(sock, options)
  sock.credsUpdate = options.authState?.saveCreds.bind(sock)

  if (sock.handler) sock.ev.on('messages.upsert', sock.handler)
  if (sock.participantsUpdate) sock.ev.on('group-participants.update', sock.participantsUpdate)
  if (sock.groupsUpdate) sock.ev.on('groups.update', sock.groupsUpdate)
  if (sock.onDelete) sock.ev.on('message.delete', sock.onDelete)
  if (sock.connectionUpdate) sock.ev.on('connection.update', sock.connectionUpdate)
  if (sock.credsUpdate) sock.ev.on('creds.update', sock.credsUpdate)

  sock.isReloadInit = false
  return true
}

// Mensajes predeterminados para grupos
export function defaultMessages() {
  return {
    welcome: '❀ 𝙱𝚒𝚎𝚗𝚟𝚎𝚗𝚒𝚍𝚘 𝚊 @subject, @user',
    bye: '❀ 𝙷𝚊𝚜𝚝𝚊 𝚙𝚛𝚘𝚗𝚝𝚘 @user 👋',
    spromote: '⛁ @user ahora es admin!',
    sdemote: '⛁ @user ya no es admin!',
    sDesc: '✿ Nueva descripción:\n@desc',
    sSubject: '✿ Nombre del grupo:\n@subject',
    sIcon: '✧ Icono del grupo actualizado.',
    sRevoke: '✧ Nuevo enlace del grupo:\n@revoke'
  }
}

// Monitor de conexión principal
async function connectionUpdate(options, update) {
  const { connection, lastDisconnect, isOnline, isNewLogin, receivedPendingNotifications } = update

  if (isNewLogin) console.log(chalk.green('✓ Sesión iniciada'))
  if (connection === 'connecting') console.log(chalk.yellow('⏳ Conectando...'))
  if (connection === 'open') console.log(chalk.green('✓ Conexión abierta'))
  if (isOnline) console.log(chalk.green('Estado: En línea'))
  if (!isOnline) console.log(chalk.red('Estado: Desconectado'))
  if (receivedPendingNotifications) console.log(chalk.yellow('⌛ Esperando nuevos mensajes...'))

  if (connection === 'close') {
    console.log(chalk.red('✧ Conexión cerrada, reintentando...'))

    const status = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    const reason = DisconnectReason[status] || 'desconocido'

    if (status !== DisconnectReason.loggedOut && status !== DisconnectReason.blockedNumber) {
      console.log({
        status,
        reason,
        message: lastDisconnect.error?.output?.payload?.message || ''
      })
      console.log(chalk.gray('Reconectando...'))
      await reload(this, true, options).catch(console.error)
    }
  }

  if (global.db?.data == null && typeof global.loadDatabase === 'function') {
    await global.loadDatabase()
  }
}

// Importación dinámica del handler
export async function importFile(module) {
  const path = resolve(module)
  const imported = await import(`${path}?id=${Date.now()}`)
  return imported?.default || imported
}

export let opts = { authState, isChild: false, usePairingCode: false }

export default {
  conn,
  opts,
  conns,
  logger,
  authFolder,
  start,
  reload,
  importFile
}