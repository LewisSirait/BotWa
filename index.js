/*
 * WhatsApp Gemini Bot
 * Created by: Lewis
 * License: MIT
 * Description: WhatsApp Bot dengan Google Gemini Pro API
 * Compatible with: Termux Android, Node.js >=16
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');
const Database = require('./db');

// Load configuration
let config;
try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (error) {
    console.error('Error loading config.json:', error.message);
    process.exit(1);
}

// Initialize database
const db = new Database();

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
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

// Event handlers
client.on('qr', (qr) => {
    console.log('🔍 Scan QR Code untuk login WhatsApp Web:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log(`✅ ${config.bot_name} berhasil terhubung!`);
    console.log(`👤 Bot Owner: ${config.owner}`);
    console.log('🚀 Bot siap menerima pesan...');
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Autentikasi gagal:', msg);
});

client.on('disconnected', (reason) => {
    console.log('❌ Bot terputus:', reason);
});

// Message handler
client.on('message', async (message) => {
    try {
        // Abaikan pesan dari grup
        if (message.from.includes('@g.us')) {
            return;
        }

        // Abaikan pesan kosong atau media
        if (!message.body || message.hasMedia) {
            return;
        }

        // Abaikan pesan dari bot sendiri
        if (message.fromMe) {
            return;
        }

        const sender = message.from.replace('@c.us', '');
        const userMessage = message.body.trim();

        console.log(`📩 Pesan dari ${sender}: ${userMessage}`);

        // Kirim indikator mengetik
        await message.getChat().then(chat => chat.sendStateTyping());

        // Proses dengan Gemini API
        const response = await processWithGemini(userMessage);

        // Kirim respons
        await message.reply(response);

        // Simpan log ke database
        db.saveLog(sender, userMessage, response);

        console.log(`✅ Respons terkirim ke ${sender}`);

    } catch (error) {
        console.error('Error handling message:', error.message);
        
        try {
            await message.reply('Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi nanti.');
        } catch (replyError) {
            console.error('Error sending error message:', replyError.message);
        }
    }
});

// Fungsi untuk memproses pesan dengan Gemini API
async function processWithGemini(message) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini_model}:generateContent?key=${config.gemini_api_key}`,
            {
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 detik timeout
            }
        );

        if (response.data && response.data.candidates && response.data.candidates[0]) {
            const generatedText = response.data.candidates[0].content.parts[0].text;
            return generatedText.trim();
        } else {
            throw new Error('Invalid response from Gemini API');
        }

    } catch (error) {
        console.error('Gemini API Error:', error.message);
        
        if (error.response) {
            console.error('API Response:', error.response.data);
        }

        // Fallback response
        return 'Maaf, saya sedang mengalami gangguan. Silakan coba lagi nanti.';
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down bot...');
    
    try {
        await client.destroy();
        db.close();
        console.log('✅ Bot berhasil dimatikan');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error.message);
        process.exit(1);
    }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the bot
console.log('🚀 Memulai WhatsApp Gemini Bot...');
console.log(`📱 Compatible dengan Termux Android`);
console.log(`🔧 Node.js version: ${process.version}`);

client.initialize();
