let handler = async (m, { conn, participants, text }) => {
  const texto = text ? `☁︎ 𝐌𝐞𝐧𝐬𝐚𝐣𝐞:\n${text}\n\n` : '';
  const mentions = participants.map(p => p.id);
  const tagList = participants.map((p, i) => `⟡ ${i + 1}. @${p.id.split('@')[0]}`).join('\n');

  await conn.sendMessage(m.chat, {
    text:
`❀ 𝐋𝐋𝐀𝐌𝐀𝐃𝐎 𝐆𝐄𝐍𝐄𝐑𝐀𝐋 ❀

${texto}✿ 𝐌𝐢𝐞𝐦𝐛𝐫𝐨𝐬 𝐞𝐧 𝐞𝐬𝐭𝐞 𝐠𝐫𝐮𝐩𝐨:\n${tagList}

╰─▸ 𝘗𝘰𝘳 𝘧𝘢𝘷𝘰𝘳, 𝘴𝘦𝘢𝘯 𝘳𝘦𝘴𝘱𝘰𝘯𝘴𝘢𝘣𝘭𝘦𝘴 𝘤𝘰𝘯 𝘦𝘴𝘵𝘢 𝘮𝘦𝘯𝘤𝘪𝘰́𝘯. ✦`,
    mentions
  }, { quoted: m });
};

handler.help = ['tagall [texto opcional]'];
handler.tags = ['group'];
handler.command = ['tagall', 'todos', 'etiquetar'];
handler.admin = true;
handler.group = true;

export default handler;