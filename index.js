const { Client, RemoteAuth } = require('whatsapp-web.js');
const { getGeminiResponse } = require('./gemini');
const fs = require('fs');
const path = require('path');

// Konfigurasi
const SESSION_PATH = './sessions';
const API_KEY = 'YOUR_GEMINI_API_KEY'; // Ganti dengan API key Anda

// Pastikan folder sessions ada
if (!fs.existsSync(SESSION_PATH)) {
    fs.mkdirSync(SESSION_PATH, { recursive: true });
}

// Inisialisasi client WhatsApp dengan RemoteAuth
const client = new Client({
    authStrategy: new RemoteAuth({
        clientId: 'gemini-bot',
        dataPath: SESSION_PATH,
        backupSyncIntervalMs: 300000 // Backup setiap 5 menit
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Event: Client siap
client.on('ready', () => {
    console.log('✅ Bot WhatsApp berhasil login dan siap digunakan!');
    console.log('🤖 Semua pesan akan otomatis dijawab oleh Gemini AI');
    console.log('📱 Bot ID:', client.info.wid.user);
});

// Event: QR Code untuk pairing (fallback jika pairing code gagal)
client.on('qr', (qr) => {
    console.log('📱 Jika pairing code gagal, scan QR code di bawah:');
    console.log(qr);
});

// Event: Authenticated
client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil! Sesi login telah disimpan');
});

// Event: Authentication failure
client.on('auth_failure', (msg) => {
    console.error('❌ Autentikasi gagal:', msg);
});

// Event: Disconnected
client.on('disconnected', (reason) => {
    console.log('⚠️  Bot terputus:', reason);
    console.log('🔄 Mencoba reconnect...');
});

// Event: Remote session saved
client.on('remote_session_saved', () => {
    console.log('💾 Sesi remote berhasil disimpan');
});

// Event: Pairing code
client.on('pairing_code', (code) => {
    console.log('🔑 Pairing Code:', code);
    console.log('📱 Masukkan kode di atas ke WhatsApp Anda:');
    console.log('   1. Buka WhatsApp');
    console.log('   2. Tap titik tiga > Perangkat Tertaut');
    console.log('   3. Tap "Tautkan Perangkat"');
    console.log('   4. Masukkan kode:', code);
});

// Event: Pesan masuk
client.on('message', async (message) => {
    try {
        // Cek apakah pesan dari bot sendiri
        if (message.fromMe) {
            return;
        }

        // Cek apakah pesan dari grup atau chat pribadi
        const chat = await message.getChat();
        const contact = await message.getContact();
        
        console.log('📨 Pesan masuk dari:', contact.name || contact.pushname || message.from);
        console.log('💬 Isi pesan:', message.body);

        // Cek apakah pesan kosong atau hanya media
        if (!message.body || message.body.trim() === '') {
            console.log('⚠️  Pesan kosong atau hanya media, diabaikan');
            return;
        }

        // Tampilkan typing indicator
        chat.sendStateTyping();

        // Kirim pesan ke Gemini API
        console.log('🤖 Mengirim pesan ke Gemini AI...');
        const geminiResponse = await getGeminiResponse(message.body, API_KEY);

        if (geminiResponse) {
            // Kirim balasan
            await message.reply(geminiResponse);
            console.log('✅ Balasan berhasil dikirim');
            console.log('🤖 Balasan:', geminiResponse.substring(0, 100) + '...');
        } else {
            // Jika Gemini gagal, kirim pesan error
            await message.reply('❌ Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.');
            console.log('❌ Gagal mendapat respons dari Gemini');
        }

    } catch (error) {
        console.error('❌ Error saat memproses pesan:', error);
        try {
            await message.reply('❌ Maaf, terjadi kesalahan sistem. Silakan coba lagi.');
        } catch (replyError) {
            console.error('❌ Error saat mengirim pesan error:', replyError);
        }
    }
});

// Error handling
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Mematikan bot...');
    await client.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Mematikan bot...');
    await client.destroy();
    process.exit(0);
});

// Jalankan bot
console.log('🚀 Memulai bot WhatsApp...');
console.log('⚠️  Pastikan Anda telah mengisi API_KEY Gemini di file ini!');
console.log('🔑 Current API Key:', API_KEY === 'YOUR_GEMINI_API_KEY' ? 'BELUM DIISI!' : 'SUDAH DIISI ✅');

if (API_KEY === 'YOUR_GEMINI_API_KEY') {
    console.log('❌ PERINGATAN: API Key Gemini belum diisi!');
    console.log('📝 Edit file index.js dan ganti YOUR_GEMINI_API_KEY dengan API key Anda');
    process.exit(1);
}

client.initialize();
