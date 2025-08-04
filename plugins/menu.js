const { 
    BufferJSON, 
    WA_DEFAULT_EPHEMERAL, 
    generateWAMessageFromContent, 
    proto, 
    generateWAMessageContent, 
    generateWAMessage, 
    prepareWAMessageMedia, 
    areJidsSameUser, 
    getContentType 
} = (await import('@adiwajshing/baileys')).default

process.env.TZ = 'America/Buenos_Aires'
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import moment from "moment-timezone";
import { xpRange } from '../lib/levelling.js'

let arrayMenu = ['all','main','anonymous','ai','jadibot','confesar','rpg','fun','search','downloader','internet','anime','nsfw','sticker','tools','group','owner','']

const allTags = {
  all: "☁︎ 𝙼𝙴𝙽Ú 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙾",
  main: "❀ 𝙼𝙴𝙽Ú 𝙿𝚁𝙸𝙽𝙲𝙸𝙿𝙰𝙻",
  downloader: "⛁ 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰𝚂 𝙳𝙸𝙶𝙸𝚃𝙰𝙻𝙴𝚂",
  jadibot: "⚿ 𝙼𝙾𝙳𝙾 𝙱𝙾𝚃 (𝚂𝚄𝙱𝙱𝙾𝚃𝚂)",
  rpg: "༄ 𝚅𝙰𝙻𝙻𝙴 𝙰𝚁𝚅𝙰𝙽𝙳𝙾𝚁 · 𝚁𝙿𝙶",
  ai: "⋆ 𝙸𝙽𝚃𝙴𝙻𝙸𝙶𝙴𝙽𝙲𝙸𝙰 𝙰𝚁𝚃𝙸𝙵𝙸𝙲𝙸𝙰𝙻",
  search: "✦ 𝙱𝚄́𝚂𝚀𝚄𝙴𝙳𝙰 𝙸𝙽𝚃𝙴𝙻𝙸𝙶𝙴𝙽𝚃𝙴",
  anime: "𖥔 𝙰𝙽𝙸𝙼𝙴 & 𝙼𝙰𝙽𝙶𝙰",
  sticker: "✿ 𝙲𝚁𝙴𝙰𝙲𝙸𝙾𝙽 𝙳𝙴 𝚂𝚃𝙸𝙲𝙺𝙴𝚁𝚂",
  fun: "✧ 𝙳𝙸𝚅𝙴𝚁𝚂𝙸𝙾́𝙽 & 𝙹𝚄𝙴𝙶𝙾𝚂",
  group: "𖹭 𝙶𝚁𝚄𝙿𝙾𝚂 & 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙲𝙸Ó𝙽",
  nsfw: "⚠︎ 𝙲𝙾𝙽𝚃𝙴𝙽𝙸𝙳𝙾 +18 (𝙽𝚂𝙵𝚆)",
  info: "☁︎ 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲𝙸𝙾́𝙽 𝙳𝙴𝙻 𝙱𝙾𝚃",
  internet: "✩ 𝚃𝙴𝙽𝙳𝙴𝙽𝙲𝙸𝙰𝚂 & 𝙴𝙽𝙻𝙰𝙲𝙴𝚂",
  owner: "⚿ 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙳𝙴 𝙾𝚆𝙽𝙴𝚁",
  tools: "🧩 𝙷𝙴𝚁𝚁𝙰𝙼𝙸𝙴𝙽𝚃𝙰𝚂 & 𝚄𝚃𝙸𝙻𝙸𝙳𝙰𝙳𝙴𝚂",
  anonymous: "🌙 𝙲𝙷𝙰𝚃 𝙰𝙽Ó𝙽𝙸𝙼𝙾",
  "": "⋆ 𝙾𝚃𝚁𝙾𝚂 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂"
}

const defaultMenu = {
  before: `
⩍⩍ ⃟🪷 ᴍᴇɴᴜ ᴡᴀɢᴜʀɪ ᴀɪ 𝆊 ꩜ ꩜
── ❀ ʜᴏʟᴀ %name ❀ ──

✎ ʙᴏᴛ: *%botName*
✎ ꜱᴏʏ ᴛᴜ ᴀsɪsᴛᴇɴᴛᴇ ᴘᴏᴇ́ᴛɪᴄᴀ ᴅᴇ ᴡʜᴀᴛsᴀᴘᴘ
✎ ᴜsᴀ *%phelp* ᴘᴀʀᴀ ᴠᴇʀ ᴄᴏᴍᴀɴᴅᴏs

☁︎ ᴜᴘᴛɪᴍᴇ: %uptime
☁︎ ꜰᴇᴄʜᴀ: %date
☁︎ ʜᴏʀᴀ: %time
`.trimStart(),

  header: '\n❀ ── `%category` ── ❀',
  body: '> ✧ %cmd %islimit %isPremium',
  footer: '',
  after: `
── ☁︎ ᴛɪᴘ ☁︎ ──
Puedes escribir *%pmenu <categoría>* para ver un menú específico
✦ Ejemplo: *%pmenu ai*
© \`%wm\``
}

let handler = async (m, { conn, usedPrefix: _p, args = [], command }) => {
    try {
//        let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
        let { exp, limit, level, role } = global.db.data.users[m.sender]
        let { min, xp, max } = xpRange(level, global.multiplier)
        let name = `@${m.sender.split`@`[0]}`
        let teks = args[0] || ''
        let setting = global.db.data.settings[conn.user.jid] || {}
        let botName = setting.botName || "Waguri Ai"
        let wm = setting.wm || "Waguri x KenisawaDev"
        
        let d = new Date(new Date + 3600000)
        let locale = 'es'
        let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        
        let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })

        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
                enabled: !plugin.disabled,
            }
        })

        if (!teks) {
let menuList = `${defaultMenu.before}

` +
`     ⩍⩍     ᴍᴇɴᴜs ᴅɪsᴘᴏɴɪʙʟᴇs   ⃟🪷\n` +
` ────────────────\n`

for (let tag of arrayMenu) {
  if (tag && allTags[tag]) {
    menuList += `❀  *\`${_p}menu ${tag}\`*\n`
  }
}

menuList += `────────────── ☁︎\n\n${defaultMenu.after}`;

            let replace = {
                '%': '%',
                p: _p, 
                uptime,
                name, 
                date,
                time,
                botName,
                wm
            }

            let text = menuList.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), 
                (_, name) => '' + replace[name])
let setting = global.db.data.settings[conn.user.jid] || {}
let menuMedia = setting.menuMedia || "https://files.catbox.moe/w4pmmz.jpg"
conn.sendFile(m.chat, menuMedia, 'menu.jpg', text, global.fkontak, null)
            return
        }

        if (!allTags[teks]) {
            return m.reply(`El menu "${teks}" no está registrado.\nEscribe ${_p}menu para ver la lista de menus.`)
        }

        let menuCategory = defaultMenu.before + '\n\n'
        
        if (teks === 'all') {
            // category all
            for (let tag of arrayMenu) {
                if (tag !== 'all' && allTags[tag]) {
                    menuCategory += defaultMenu.header.replace(/%category/g, allTags[tag]) + '\n'
                    
                    let categoryCommands = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
                    for (let menu of categoryCommands) {
                        for (let help of menu.help) {
                            menuCategory += defaultMenu.body
                                .replace(/%cmd/g, menu.prefix ? help : _p + help)
                                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n'
                        }
                    }
                    menuCategory += defaultMenu.footer + '\n'
                }
            }
        } else {
            menuCategory += defaultMenu.header.replace(/%category/g, allTags[teks]) + '\n'
            
            let categoryCommands = help.filter(menu => menu.tags && menu.tags.includes(teks) && menu.help)
            for (let menu of categoryCommands) {
                for (let help of menu.help) {
                    menuCategory += defaultMenu.body
                        .replace(/%cmd/g, menu.prefix ? help : _p + help)
                        .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                        .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n'
                }
            }
            menuCategory += defaultMenu.footer + '\n'
        }

        menuCategory += '\n' + defaultMenu.after
        
        let replace = {
            '%': '%',
            p: _p, 
            uptime, 
            name,
            date,
            time,
            botName,
            wm
        }

        let text = menuCategory.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), 
            (_, name) => '' + replace[name])

let menuMedia = setting.botIcon || "https://files.catbox.moe/gi65bh.png"

/*await conn.sendMessage(m.chat, {
  image: { url: menuMedia },
  caption: text,
  footer: wm,
  buttons: [
    {
      buttonId: `${_p}owner`,
      buttonText: { displayText: '🌟 Owner' },
      type: 1
    },
    {
      buttonId: `${_p}profile`,
      buttonText: { displayText: '🎗️ Tu Perfil' },
      type: 1
    },
{
  type: 4,
  nativeFlowInfo: {
    name: 'single_select',
    paramsJson: JSON.stringify({
      title: '⋆❀ 𝙼𝙴𝙽𝚄𝚂 𝙳𝙴𝙲𝙾𝚁𝙰𝙳𝙾𝚂 ❀⋆',
      sections: [
        {
          title: "✦ Elegí una categoría",
          rows: arrayMenu
            .filter(tag => tag && allTags[tag])
            .map(tag => ({
              title: `${allTags[tag] || 'Menú'}`,
              id: `${_p}menu ${tag}`
            }))
        }
      ]
    })
  }
}
  ],
  headerType: 1,
  viewOnce: true
}, { quoted: m })*/
conn.sendFile(m.chat, menuMedia, 'menu.jpg', text, global.fkontak, null)
    } catch (e) {
        conn.reply(m.chat, 'Perdon, hay un error con el menu', m)
        console.error(e)
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|menú)$/i
handler.exp = 3

export default handler;

function clockString(ms) {
    if (isNaN(ms)) return '--'
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}