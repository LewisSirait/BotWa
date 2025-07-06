# WhatsApp Gemini Bot

Bot WhatsApp otomatis yang terintegrasi dengan Google Gemini AI. Semua pesan yang masuk akan otomatis dijawab oleh AI tanpa perlu perintah khusus.

## ✨ Fitur Utama

- 🤖 **Auto-Reply**: Semua pesan otomatis dijawab oleh Gemini AI
- 🔐 **Pairing Code**: Login menggunakan pairing code (tanpa QR scan)
- 💾 **Persistent Session**: Sesi login tersimpan, tidak perlu login ulang
- 🚀 **Headless**: Bisa dijalankan tanpa GUI browser
- 📱 **Multi-Platform**: Kompatibel dengan Termux dan Pterodactyl Panel
- 🛡️ **Error Handling**: Penanganan error yang robust

## 🔧 Persyaratan Sistem

### Untuk Termux (Android)
- Android 7.0+ 
- RAM minimal 2GB
- Storage minimal 1GB kosong
- Koneksi internet stabil

### Untuk VPS/Server (Pterodactyl)
- Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- Node.js 14.0.0+
- RAM minimal 512MB
- Storage minimal 1GB kosong

## 🚀 Instalasi Cepat

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/whatsapp-gemini-bot.git
cd whatsapp-gemini-bot
```

### 2. Jalankan Script Instalasi
```bash
chmod +x install.sh
./install.sh
```

Script akan otomatis:
- Install dependencies sistem
- Install Node.js packages
- Setup file permissions
- Test instalasi

### 3. Konfigurasi API Key
Edit file `index.js` dan ganti `YOUR_GEMINI_API_KEY` dengan API key Anda:

```javascript
const API_KEY = 'YOUR_GEMINI_API_KEY'; // Ganti dengan API key Anda
```

## 📋 Instalasi Manual

### Termux (Android)

1. **Update dan Install Dependencies**
```bash
pkg update -y && pkg upgrade -y
pkg install -y nodejs npm git curl wget chromium
```

2. **Clone dan Setup**
```bash
git clone https://github.com/yourusername/whatsapp-gemini-bot.git
cd whatsapp-gemini-bot
npm install
```

3. **Edit Konfigurasi**
```bash
nano index.js
# Ganti YOUR_GEMINI_API_KEY dengan API key Anda
```

4. **Edit Konfigurasi**
```bash
nano index.js
# Ganti YOUR_GEMINI_API_KEY dengan API key Anda
```

5. **Jalankan Bot**
```bash
node index.js
```

## 🔑 Mendapatkan API Key Gemini

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google Anda
3. Klik "Create API Key"
4. Copy API key yang dihasilkan
5. Paste ke file `index.js` menggantikan `YOUR_GEMINI_API_KEY`

## 📱 Cara Pairing WhatsApp

### Metode 1: Pairing Code (Recommended)
1. Jalankan bot: `node index.js`
2. Bot akan menampilkan pairing code (8 digit)
3. Buka WhatsApp di HP Anda
4. Tap menu **⋮** → **Perangkat Tertaut**
5. Tap **"Tautkan Perangkat"**
6. Masukkan pairing code yang ditampilkan bot

### Metode 2: QR Code (Fallback)
Jika pairing code gagal, bot akan menampilkan QR code untuk di-scan.

## 🏃‍♂️ Menjalankan Bot

### Jalankan Sekali
```bash
node index.js
```

### Jalankan dengan Auto-Restart (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Jalankan bot dengan PM2
pm2 start index.js --name "whatsapp-gemini-bot"

# Melihat logs
pm2 logs whatsapp-gemini-bot

# Restart bot
pm2 restart whatsapp-gemini-bot

# Stop bot
pm2 stop whatsapp-gemini-bot
```

### Jalankan di Background (Termux)
```bash
# Menggunakan nohup
nohup node index.js &

# Atau menggunakan screen
screen -S whatsapp-bot
node index.js
# Tekan Ctrl+A lalu D untuk detach
```

## 📁 Struktur File

```
whatsapp-gemini-bot/
├── index.js          # File utama bot WhatsApp
├── gemini.js          # Modul untuk integrasi Gemini API
├── package.json       # Konfigurasi dependencies
├── package-lock.json  # Lock file dependencies
├── install.sh         # Script instalasi otomatis
├── README.md          # Dokumentasi ini
└── sessions/          # Folder untuk menyimpan sesi login
    └── RemoteAuth-gemini-bot/
```

## ⚙️ Konfigurasi Lanjutan

### Mengubah Temperature AI
Edit file `gemini.js` pada bagian `generationConfig`:

```javascript
generationConfig: {
    temperature: 0.7,    // 0.0 = konservatif, 1.0 = kreatif
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024
}
```

### Mengubah Safety Settings
Edit file `gemini.js` pada bagian `safetySettings` untuk mengatur level keamanan konten.

### Menambah Prefix untuk Pesan Bot
Edit file `index.js` dan tambahkan prefix pada respons:

```javascript
await message.reply(`🤖 ${geminiResponse}`);
```

## 🔧 Troubleshooting

### Bot Tidak Bisa Login
1. **Hapus sesi lama**:
   ```bash
   rm -rf sessions/
   ```

2. **Restart bot**:
   ```bash
   node index.js
   ```

3. **Coba pairing code baru**

### Error "API Key tidak valid"
1. Pastikan API key sudah benar
2. Cek apakah API key sudah aktif di Google AI Studio
3. Pastikan tidak ada spasi tambahan di API key

### Bot Tidak Merespon Pesan
1. Cek console log untuk error
2. Pastikan koneksi internet stabil
3. Restart bot jika diperlukan

### Error Dependencies
1. **Clear cache dan reinstall**:
   ```bash
   npm run clean
   npm install
   ```

2. **Update dependencies**:
   ```bash
   npm update
   ```

### Memory Usage Tinggi
1. **Restart bot secara berkala**:
   ```bash
   pm2 restart whatsapp-gemini-bot
   ```

2. **Gunakan PM2 dengan limit memory**:
   ```bash
   pm2 start index.js --name "whatsapp-gemini-bot" --max-memory-restart 500M
   ```

## 📊 Monitoring

### Melihat Status Bot
```bash
# Dengan PM2
pm2 status

# Melihat logs real-time
pm2 logs whatsapp-gemini-bot --lines 50
```

### Resource Usage
```bash
# Monitor CPU dan Memory
htop

# Atau gunakan PM2 monitoring
pm2 monit
```

## 🚨 Penting untuk Diingat

1. **Jangan Share API Key**: API key bersifat rahasia, jangan share ke orang lain
2. **Backup Sesi**: Folder `sessions/` berisi data login, backup secara berkala
3. **Rate Limiting**: Gemini API memiliki rate limit, jangan spam berlebihan
4. **Responsible Use**: Gunakan bot secara bertanggung jawab
5. **Keep Updated**: Update dependencies secara berkala untuk keamanan

## 🆘 Bantuan dan Support

### Logs dan Debugging
Bot akan menampilkan berbagai informasi di console:
- ✅ Informasi sukses (hijau)
- ⚠️ Peringatan (kuning)  
- ❌ Error (merah)
- 📨 Pesan masuk
- 🤖 Respons AI

### Community Support
Jika mengalami masalah:
1. Cek bagian Troubleshooting di atas
2. Buka issue di GitHub repository
3. Sertakan logs error dan informasi sistem

## 📜 Lisensi

MIT License - Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📈 Changelog

### v1.0.0
- ✅ Integrasi dengan Gemini AI
- ✅ Pairing code support
- ✅ Persistent session
- ✅ Auto-reply semua pesan
- ✅ Cross-platform support
- ✅ Error handling

---

**Dibuat dengan ❤️ untuk komunitas WhatsApp Bot Indonesia**

> **Disclaimer**: Bot ini dibuat untuk tujuan edukasi dan personal use. Gunakan dengan bijak dan patuhi Terms of Service WhatsApp serta Google Gemini API.Jalankan Bot**
```bash
node index.js
```

1. **Install Node.js (jika belum ada)**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

2. **Install Dependencies Sistem**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y git curl wget
sudo apt install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release xdg-utils

# CentOS/RHEL
sudo yum update -y
sudo yum install -y git curl wget
```

3. **Clone dan Setup**
```bash
git clone https://github.com/yourusername/whatsapp-gemini-bot.git
cd whatsapp-gemini-bot
npm install
```

4. **
