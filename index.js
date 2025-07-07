const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const chalk = require('chalk');
const figlet = require('figlet');
const fs = require('fs');
const { handleMessage } = require('./lib/messages');

const logger = pino({ level: 'silent' });

async function startBot() {
    console.log(chalk.green(figlet.textSync('WhatsApp Bot', { horizontalLayout: 'full' })));
    
    const { state, saveCreds } = await useMultiFileAuthState('./yusril');
    
    const sock = makeWASocket({
        logger,
        printQRInTerminal: true,
        auth: state,
        browser: ['WhatsApp Bot', 'Desktop', '1.0.0']
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('Connection closed due to'), lastDisconnect.error, chalk.yellow('reconnecting'), shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green('Connected successfully!'));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.key.fromMe && msg.key.remoteJid && !msg.key.remoteJid.endsWith('@g.us')) {
                await handleMessage(sock, msg);
            }
        } catch (error) {
            console.error(chalk.red('Error handling message:'), error);
        }
    });
}

startBot().catch(err => console.error(chalk.red('Error starting bot:'), err));
