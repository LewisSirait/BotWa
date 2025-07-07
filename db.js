/*
 * WhatsApp Gemini Bot - Database Handler
 * Created by: Lewis
 * License: MIT
 * Description: Database handler untuk menyimpan log chat
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, 'chatlog.db');
        this.db = new sqlite3.Database(this.dbPath);
        this.init();
    }

    init() {
        const sql = `
            CREATE TABLE IF NOT EXISTS chat_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender TEXT NOT NULL,
                message TEXT NOT NULL,
                response TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        this.db.run(sql, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Database initialized successfully');
            }
        });
    }

    saveLog(sender, message, response) {
        const sql = `INSERT INTO chat_logs (sender, message, response) VALUES (?, ?, ?)`;
        
        this.db.run(sql, [sender, message, response], function(err) {
            if (err) {
                console.error('Error saving log:', err.message);
            } else {
                console.log(`Log saved with ID: ${this.lastID}`);
            }
        });
    }

    getLogs(sender = null, limit = 50) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM chat_logs`;
            let params = [];
            
            if (sender) {
                sql += ` WHERE sender = ?`;
                params.push(sender);
            }
            
            sql += ` ORDER BY timestamp DESC LIMIT ?`;
            params.push(limit);
            
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

module.exports = Database;
