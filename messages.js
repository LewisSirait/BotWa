const axios = require('axios');
const fs = require('fs');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const key = JSON.parse(fs.readFileSync('./key.json', 'utf8'));
const genAI = new GoogleGenerativeAI(key.gemini_api_key);

async function handleMessage(sock, msg) {
    const from = msg.key.remoteJid;
    const messageType = Object.keys(msg.message)[0];
    
    try {
        if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
            const text = msg.message.conversation || msg.message.extendedTextMessage.text;
            const response = await getGeminiResponse(text);
            await sock.sendMessage(from, { text: response });
        } 
        else if (messageType === 'imageMessage') {
            const caption = msg.message.imageMessage.caption || 'Describe this image';
            const imageBuffer = await downloadContentFromMessage(msg.message.imageMessage, 'image');
            
            let buffer = Buffer.alloc(0);
            for await (const chunk of imageBuffer) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const response = await getGeminiVisionResponse(caption, buffer);
            await sock.sendMessage(from, { text: response });
        }
        else if (messageType === 'videoMessage') {
            await sock.sendMessage(from, { text: 'Maaf, saya belum bisa memproses video. Silakan kirim gambar atau teks.' });
        }
        else if (messageType === 'audioMessage') {
            await sock.sendMessage(from, { text: 'Maaf, saya belum bisa memproses audio. Silakan kirim gambar atau teks.' });
        }
        else if (messageType === 'documentMessage') {
            await sock.sendMessage(from, { text: 'Maaf, saya belum bisa memproses dokumen. Silakan kirim gambar atau teks.' });
        }
        else {
            await sock.sendMessage(from, { text: 'Halo! Saya adalah AI Assistant. Kirim pesan teks atau gambar untuk berinteraksi dengan saya.' });
        }
    } catch (error) {
        console.error('Error in handleMessage:', error);
        await sock.sendMessage(from, { text: 'Maaf, terjadi kesalahan. Silakan coba lagi.' });
    }
}

async function getGeminiResponse(text) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting Gemini response:', error);
        return 'Maaf, terjadi kesalahan saat memproses permintaan Anda.';
    }
}

async function getGeminiVisionResponse(text, imageBuffer) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        
        const imageParts = [
            {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: 'image/jpeg'
                }
            }
        ];
        
        const result = await model.generateContent([text, ...imageParts]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting Gemini vision response:', error);
        return 'Maaf, terjadi kesalahan saat memproses gambar Anda.';
    }
}

module.exports = { handleMessage };
