var handler = async (m, { text, conn }) => {
    let user = global.db.data.users[m.sender]
    user.afk = +new Date
    user.afkReason = text

    let name = await conn.getName(m.sender)

    m.reply(`\`⋆﹢🌙﹕𝙼𝚘𝚍𝚘 𝙰𝙵𝙺 𝚊𝚌𝚝𝚒𝚟𝚊𝚍𝚘 ˚₊‧\`
    
𖦹 ${name} ha entrado en modo AFK.
${text ? `✎ 𝚁𝚊𝚣𝚘́𝚗: _${text}_` : '✎ Sin motivo especificado.'}

🕯️ 𝙴𝚜𝚙𝚎𝚛𝚊𝚛𝚎𝚖𝚘𝚜 𝚝𝚞 𝚟𝚞𝚎𝚕𝚝𝚊 𝚌𝚘𝚗 𝚝𝚎 💌`)
}

handler.help = ['afk <razón>']
handler.tags = ['main']
handler.command = /^afk$/i

export default handler