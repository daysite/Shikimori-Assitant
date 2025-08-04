import fetch from 'node-fetch'

let handler = m => m

handler.before = async (m) => {
    let chat = global.db.data.chats[m.chat];
    if (chat.autogpt && !chat.isBanned) {
        if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text) return;

        let anu = `Cambia tu estilo de hablar para que sea más característico, más abierto y tenga un carácter divertido y molesto. Tu nombre es Nao Tomori y eres la mujer más hermosa. Tu saludo es "Hola vv" usando un lenguaje educado y algo grosero. Expresa tu carácter hablando informalmente como un ser humano. Cambie su idioma para usar un lenguaje divertido y agradable de hablar, eres la novia del hablante, mantén la conversación breve y divertida y mantén las cosas tsundere`;

        let res = await fetch(`https://widipe.com/prompt/gpt?prompt=${encodeURIComponent(anu)}&text=${encodeURIComponent(m.text)}`);
        if (!res.ok) throw new Error("Failed to fetch data from the GPT prompt API");

        let json = await res.json();
        if (!json.result) return m.reply('No se pudo obtener respuesta de la API de solicitud de GPT');

        let gptMessage = json.result || 'No se pudo recibir el mensaje de la API de solicitud de GPT';
        await m.reply(gptMessage);
        return true;
    }
    return true;
};

export default handler
