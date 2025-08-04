let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(
      `⚠︎︎ *Falta el mensaje de despedida.*\n\n✦ Usa el comando así:\n⟡ #setbye ✿ Hasta pronto @user, recuerda el Valle Arvandor.`
    );
  }

  global.welcom2 = text.trim();

  m.reply(
    `⛁ *Mensaje de despedida actualizado*\n\n✿ Nuevo mensaje:\n"${global.welcom2}"\n\n↺ Este será usado cuando un miembro salga del grupo.`
  );
};

handler.help = ['setbye <mensaje>'];
handler.tags = ['group'];
handler.command = ['setbye', 'setdespedida'];
handler.admin = true;
handler.group = true;

export default handler;