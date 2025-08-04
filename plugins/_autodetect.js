import { WAMessageStubType } from '@adiwajshing/baileys';

export async function before(m) {
  if (!m.messageStubType || !m.isGroup) return;

  const autor = `🧙‍♂️ @${m.sender.split('@')[0]} 🧙‍♂️`;
  const objetivo = (m.messageStubParameters?.[0] || '').split('@')[0];

  const mensajes = {
    1: `*reinició* el enlace del grupo ♻️`,
    21: `cambió el nombre del grupo a:\n📜 *${m.messageStubParameters[0]}*`,
    22: `cambió el ícono del grupo 🖼️`,
    23: `*reinició* el enlace del grupo ♻️`,
    24: `cambió la descripción del grupo:\n\n${m.messageStubParameters[0]}`,
    25: `configuró que *${m.messageStubParameters[0] === 'on' ? 'solo los administradores' : 'todos los miembros'}* puedan editar la información del grupo. 🔧`,
    26: `${m.messageStubParameters[0] === 'on' ? '*cerró* el grupo 🔒\nAhora solo los administradores pueden enviar mensajes.' : '*abrió* el grupo 🔓\nAhora todos los miembros pueden enviar mensajes.'}`,
    29: `ascendió a @${objetivo} como administrador. 👨‍💼`,
    30: `removió a @${objetivo} de administrador. 👨‍💼🚪`,
    33: `cambió su número de teléfono 📱`,
    45: `inició una llamada grupal 📞`,
    46: `inició una llamada grupal 📞`,
    71: `está intentando unirse al grupo 🚪`,
    72: `cambió la duración de los mensajes temporales a *@${m.messageStubParameters[0]}* ⏱️`,
    74: `envió un medio de una sola visualización 📷`,
    123: `*desactivó* los mensajes temporales 🕓`,
    141: `se unió al grupo mediante un enlace 🌐`,
    142: `creó un grupo de comunidad 🛋️`,
    143: `eliminó un grupo de comunidad 🗑️`,
    156: `creó una encuesta en el grupo 📊`,
  };

  const texto = mensajes[m.messageStubType];

  if (texto) {
    await this.sendMessage(m.chat, {
      text: `${autor} ${texto}`,
      mentions: m.messageStubParameters[0] !== undefined ? [m.sender, m.messageStubParameters[0]] : [m.sender]
    });
  } else {
    // para registrar nuevos tipos de eventos no mapeados
    console.log({
      tipo: m.messageStubType,
      parámetros: m.messageStubParameters,
      descripción: WAMessageStubType[m.messageStubType],
    });
  }
}

export const disabled = false;