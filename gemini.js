const axios = require('axios');

/**
 * Mengirim pesan ke Google Gemini API dan mendapat respons
 * @param {string} message - Pesan yang akan dikirim ke Gemini
 * @param {string} apiKey - API Key Google Gemini
 * @returns {Promise<string|null>} - Respons dari Gemini atau null jika error
 */
async function getGeminiResponse(message, apiKey) {
    try {
        // Validasi input
        if (!message || !apiKey) {
            throw new Error('Message dan API Key harus diisi');
        }

        // URL endpoint Gemini API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        // Payload untuk request
        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: message
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
                stopSequences: []
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        // Konfigurasi axios
        const config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'WhatsApp-Gemini-Bot/1.0'
            },
            data: payload,
            timeout: 30000 // 30 detik timeout
        };

        console.log('🔄 Mengirim request ke Gemini API...');
        
        // Kirim request ke Gemini
        const response = await axios(config);

        // Cek apakah respons berhasil
        if (response.status === 200 && response.data) {
            const candidates = response.data.candidates;
            
            if (candidates && candidates.length > 0) {
                const content = candidates[0].content;
                
                if (content && content.parts && content.parts.length > 0) {
                    const text = content.parts[0].text;
                    
                    if (text) {
                        console.log('✅ Berhasil mendapat respons dari Gemini');
                        return text.trim();
                    }
                }
            }
            
            // Jika struktur respons tidak sesuai
            console.log('⚠️  Respons Gemini tidak memiliki format yang diharapkan');
            console.log('Response data:', JSON.stringify(response.data, null, 2));
            return 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.';
        }

        // Jika status bukan 200
        console.log('❌ Respons Gemini tidak berhasil. Status:', response.status);
        return null;

    } catch (error) {
        console.error('❌ Error saat memanggil Gemini API:', error.message);
        
        // Handle berbagai jenis error
        if (error.response) {
            // Server merespons dengan error status
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            
            if (error.response.status === 400) {
                return 'Maaf, format pesan tidak valid untuk diproses.';
            } else if (error.response.status === 401) {
                return 'Maaf, terjadi masalah autentikasi API. Silakan periksa API Key.';
            } else if (error.response.status === 429) {
                return 'Maaf, terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.';
            } else if (error.response.status === 500) {
                return 'Maaf, server Gemini sedang bermasalah. Silakan coba lagi nanti.';
            }
        } else if (error.request) {
            // Request dibuat tapi tidak ada respons
            console.error('No response received:', error.request);
            return 'Maaf, tidak dapat terhubung ke server Gemini. Periksa koneksi internet Anda.';
        } else if (error.code === 'ECONNABORTED') {
            // Timeout
            return 'Maaf, permintaan memakan waktu terlalu lama. Silakan coba lagi.';
        }
        
        return null;
    }
}

/**
 * Test koneksi ke Gemini API
 * @param {string} apiKey - API Key Google Gemini
 * @returns {Promise<boolean>} - True jika koneksi berhasil
 */
async function testGeminiConnection(apiKey) {
    try {
        const testMessage = 'Hello, are you working?';
        const response = await getGeminiResponse(testMessage, apiKey);
        return response !== null;
    } catch (error) {
        console.error('❌ Test koneksi Gemini gagal:', error.message);
        return false;
    }
}

module.exports = {
    getGeminiResponse,
    testGeminiConnection
};
