import axios from 'axios';
import FormData from 'form-data';
import yts from 'yt-search';

let handler = async (m, { conn, args, text }) => {
  if (!args[0]) throw m.reply('Proporcione una consulta');
  
   let results = await yts(text);
   let tes = results.videos[0]
    
const mp3Result = await youtubeScraper.youtubeMp3(tes.url);
if (mp3Result.success) {
  console.log("Title:", mp3Result.data.title);
  console.log("Download URL:", mp3Result.data.downloadUrl);

await conn.sendMessage(m.chat, {
      audio: { url: mp3Result.data.downloadUrl },
      mimetype: "audio/mp4",
      fileName: tes.title,
      mentions: [m.sender]
    }, { quoted: m });

} else {
  console.error("Error:", mp3Result.error);
}
}
handler.help = ['play3 *<consulta>*'];
handler.tags = ['downloader'];
handler.command = ["play3","song3","musica3"];

export default handler


class Success {
  constructor(data) {
    this.success = true;
    this.data = data;
  }
}

class ErrorResponse {
  constructor(error) {
    this.success = false;
    this.error = error;
  }
}

const youtubeScraper = {
  youtubeMp3: async (url) => {
    try {
      if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
        return new ErrorResponse({
          message: "URL YouTube tidak valid!"
        });
      }

      const ds = new FormData();
      ds.append("url", url);
      
      const { data } = await axios.post(
        "https://www.youtubemp3.ltd/convert",
        ds,
        {
          headers: {
            ...ds.getHeaders(),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 45000
        }
      );
      
      if (!data || !data.link) {
        return new ErrorResponse({
          message: "Gagal mendapatkan link download"
        });
      }
      
      return new Success({
        title: data.filename || "Unknown Title",
        downloadUrl: data.link,
        type: "mp3"
      });
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return new ErrorResponse({
          message: "Request timeout, coba lagi nanti"
        });
      }
      
      return new ErrorResponse({
        message: error.response?.data?.message || error.message || "Gagal convert YouTube ke MP3"
      });
    }
  },

  ytdl: async (url, quality = "720") => {
    try {
      if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
        return new ErrorResponse({
          message: "URL YouTube tidak valid!"
        });
      }

      const validQuality = {
        "480": 480,
        "1080": 1080,
        "720": 720,
        "360": 360,
        "audio": "mp3",
      };
      
      if (!Object.keys(validQuality).includes(quality)) {
        return new ErrorResponse({
          message: "Quality tidak valid!",
          availableQuality: Object.keys(validQuality)
        });
      }
      
      const qualitys = validQuality[quality];
      
      const { data: firstRequest } = await axios.get(
        `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${qualitys}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`,
        { 
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );
      
      if (!firstRequest || !firstRequest.progress_url) {
        return new ErrorResponse({
          message: "Gagal memulai proses download"
        });
      }
      
      const { progress_url } = firstRequest;
      let metadata = {
        image: firstRequest.info?.image || "",
        title: firstRequest.info?.title || "Unknown Title",
        downloadUrl: "",
        quality: quality,
        type: quality === "audio" ? "mp3" : "mp4"
      };
      
      let datas;
      let attempts = 0;
      const maxAttempts = 40;
      
      console.log("Memproses download, mohon tunggu...");
      
      do {
        if (attempts >= maxAttempts) {
          return new ErrorResponse({
            message: "Timeout: Proses download terlalu lama, coba lagi"
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
          const { data } = await axios.get(progress_url, { 
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          datas = data;
          
          if (datas.progress && datas.progress < 100) {
            console.log(`Progress: ${datas.progress}%`);
          }
          
        } catch (pollError) {
          console.log(`Polling attempt ${attempts + 1} failed, retrying...`);
        }
        
        attempts++;
      } while (!datas?.download_url);
      
      if (!datas.download_url) {
        return new ErrorResponse({
          message: "Gagal mendapatkan URL download"
        });
      }
      
      metadata.downloadUrl = datas.download_url;
      console.log("Download siap!");
      
      return new Success(metadata);
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return new ErrorResponse({
          message: "Request timeout, coba lagi nanti"
        });
      }
      
      return new ErrorResponse({
        message: error.response?.data?.message || error.message || "Gagal download video"
      });
    }
  },

  // Utility function untuk validasi URL YouTube
  isValidYouTubeUrl: (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  },

  // Utility function untuk extract video ID
  extractVideoId: (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
};

// Contoh penggunaan:
/*
// MP3 Download
const mp3Result = await youtubeScraper.youtubeMp3("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
if (mp3Result.success) {
  console.log("Title:", mp3Result.data.title);
  console.log("Download URL:", mp3Result.data.downloadUrl);
} else {
  console.error("Error:", mp3Result.error);
}

// Video Download
const videoResult = await youtubeScraper.ytdl("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "720");
if (videoResult.success) {
  console.log("Title:", videoResult.data.title);
  console.log("Thumbnail:", videoResult.data.image);
  console.log("Download URL:", videoResult.data.downloadUrl);
  console.log("Quality:", videoResult.data.quality);
} else {
  console.error("Error:", videoResult.error);
}
*/