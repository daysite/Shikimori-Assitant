import axios from 'axios';

let handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '✧ Por favor ingresa un número de DNI válido.\n\nEjemplo:\n`.dni 12345678`', m);
  }

  const dni = args[0].trim();
  const API_URL = 'https://api.factiliza.com/v1';
  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzODc10CIsImh0dHA6Ly9zY2h1bWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImNvbnN1bHRvciJ9.0ed6VqQzrDKDexyrRAWvd2gdexoHqD7mmQcPSAGZNQ4';

  try {
    const res = await axios.get(`${API_URL}/dni/info/${dni}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const data = res.data;

    if (data.success) {
      const info = data.data;

      let txt = `
*✧ Resultados de Consulta DNI ${dni}:*

*Nombre Completo:* ${info.nombre_completo}
*Ubicación:*
• Departamento: ${info.departamento}
• Provincia: ${info.provincia}
• Distrito: ${info.distrito}
• Dirección: ${info.direccion_completa}
`;

      await conn.reply(m.chat, txt.trim(), m);
    } else {
      await conn.reply(m.chat, `✖️ Error en la consulta: ${data.message || 'DNI no encontrado o error en el servidor.'}`, m);
    }
  } catch (err) {
    console.error('Error en consulta DNI:', err);
    let errorMsg = '⚠️ Ocurrió un error al conectar con el servicio de consulta.';
    if (err.response) {
      errorMsg += `\nCódigo: ${err.response.status}`;
      if (err.response.data && err.response.data.message) {
        errorMsg += `\nMensaje: ${err.response.data.message}`;
      }
    } else if (err.message) {
      errorMsg += '\n' + err.message;
    }
    await conn.reply(m.chat, errorMsg, m);
  }
};

handler.command = ['dni', 'consultadni'];
handler.help = ['dni <número>'];
handler.tags = ['herramientas'];

export default handler;