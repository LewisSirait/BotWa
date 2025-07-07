
WhatsApp Gemini Bot
Created by: Lewis
License: MIT

WhatsApp Chatbot yang terhubung dengan Google Gemini Pro API. Bot ini dapat berjalan di Termux Android tanpa GUI dan otomatis membalas pesan pribadi.

✨ Fitur Utama
🤖 Auto Reply: Otomatis membalas semua pesan pribadi tanpa perintah
🧠 AI Powered: Menggunakan Google Gemini Pro API
📱 Termux Support: Kompatibel dengan Termux Android
💾 Database Log: Menyimpan semua chat dalam database SQLite
🔐 Session Management: Sesi tersimpan dengan LocalAuth
🚫 Group Filter: Mengabaikan pesan dari grup
📋 Persyaratan
Node.js versi 16 atau lebih baru
Google Gemini Pro API Key
Koneksi internet yang stabil
🛠️ Instalasi
Di Termux Android:
Install Node.js dan Git:
bash
pkg update && pkg upgrade
pkg install nodejs git
Clone/Download project:
bash
git clone <repository-url>
cd whatsapp-gemini-bot
Install dependencies:
bash
npm install
Konfigurasi API Key:
Buka file config.json
Ganti YOUR_GEMINI_API_KEY_HERE dengan API Key Gemini Anda
Dapatkan API Key di: https://makersuite.google.com/app/apikey
Jalankan bot:
bash
npm start
Di PC/Linux:
Install Node.js:
Download dari https://nodejs.org/
Atau gunakan package manager: sudo apt install nodejs npm
Clone project dan install:
bash
git clone <repository-url>
cd whatsapp-gemini-bot
npm install
Konfigurasi dan jalankan:
bash
# Edit config.json dengan API Key Anda
npm start
⚙️ Konfigurasi
Edit file config.json:

json
{
  "gemini_api_key": "YOUR_GEMINI_API_KEY_HERE",
  "gemini_model": "gemini-pro",
  "bot_name": "WhatsApp Gemini Bot",
  "owner": "Lewis"
}
🚀 Cara Menggunakan
Jalankan bot:
bash
npm start
Scan QR Code:
QR Code akan muncul di terminal
Scan dengan WhatsApp di ponsel Anda
Bot akan otomatis login dan siap digunakan
Mulai Chat:
Kirim pesan pribadi ke nomor WhatsApp yang login
Bot akan otomatis membalas dengan respons dari Gemini AI
Semua chat akan tersimpan dalam database
📊 Database
Bot menggunakan SQLite untuk menyimpan log chat:

File database: chatlog.db
Tabel: chat_logs
Kolom: id, sender, message, response, timestamp
🔧 Troubleshooting
Error "puppeteer"
bash
# Di Termux, install chromium
pkg install chromium
Error "sqlite3"
bash
# Install build tools
pkg install python make clang
npm rebuild sqlite3
Error "ENOSPC"
bash
# Increase file watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
QR Code tidak muncul
Pastikan terminal mendukung Unicode
Coba perbesar ukuran terminal
Restart bot jika perlu
📱 Termux Specific Tips
Prevent sleep:
bash
termux-wake-lock
Run in background:
bash
nohup npm start &
Check logs:
bash
tail -f nohup.out
🚫 Batasan
Bot hanya membalas pesan pribadi (bukan grup)
Mengabaikan pesan media/file
Memerlukan koneksi internet stabil
API Gemini memiliki rate limit
📝 Log Files
chatlog.db: Database SQLite dengan semua chat
nohup.out: Log output (jika run dengan nohup)
🔒 Keamanan
Jangan share API Key Anda
Gunakan environment variables untuk production
Backup database secara berkala
📞 Support
Jika mengalami masalah:

Periksa log error di terminal
Pastikan API Key valid
Cek koneksi internet
Restart bot jika diperlukan
📄 License
MIT License - Created by Lewis

Happy Coding! 🚀

Made with
