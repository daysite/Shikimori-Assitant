import fs from 'fs'

var handler = async (m, { text }) => {
                    await conn.sendMessage(m.chat, {
                    productMessage: {
                        title: "🪽 — ( Waguri Ai • WhatsApp Bot )",
                        description: wm,
                        thumbnail: fs.readFileSync('./thumbnail.jpg'),
                        productId: "123456789",
                        retailerId: "TOKOKU",
                        url: "https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F",
                        body: "kdev",
                        footer: wm,
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "K",
                                    url: "https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F"
                                })
                            }
                        ]
                    }
                }, { quoted: m });
                
}

  handler.command = ["tes"]
  
  export default handler