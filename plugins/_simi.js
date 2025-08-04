import fetch from 'node-fetch'
let handler = m => m

handler.before = async (m) => {
   let chat = global.db.data.chats[m.chat]
     if (chat.simi && !chat.isBanned) {
       if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return
         if (!m.text) return
        
         const data = new URLSearchParams()
        data.append('text', m.text)
       data.append('lc', 'es')
      data.append('key', '')

        
  let cylic = await fetch('https://simsimi.vn/web/simtalk', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': 'application/json, text/javascript, */*; q=0.01', 'X-Requested-With': 'XMLHttpRequest' }, body: data })

        let result = await cylic.json()
        await m.reply(result.success)
        return !0
    }
    return true
}

export default handler
