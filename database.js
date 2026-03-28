const mysql = require('mysql2/promise');
const chalk = require('chalk');

let db;

async function connectDB() {
    try {
        db = await mysql.createConnection({
            host: 'nc1.lemonhost.me',
            port: 3306,
            user: 'u4609_fe3oNk4tsc',
            password: 'ehCEc3IfdnwgMEZo',
            database: 's4609_Axgard BOT Database 1'
        });

        console.log(chalk.green("[DATABASE]") + " MySQL Connected successfully!");

        // Create tables
        await db.execute(`
            CREATE TABLE IF NOT EXISTS warns (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guildId VARCHAR(30) NOT NULL,
                userId VARCHAR(30) NOT NULL,
                reason TEXT,
                moderator VARCHAR(100),
                time BIGINT,
                INDEX idx_guild_user (guildId, userId)
            )
        `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS blacklist (
                guildId VARCHAR(30) NOT NULL,
                userId VARCHAR(30) NOT NULL,
                reason TEXT,
                time BIGINT,
                byUser VARCHAR(100),
                PRIMARY KEY (guildId, userId)
            )
        `);

    } catch (err) {
        console.error(chalk.red("[DATABASE ERROR]"), err.message);
    }
}

module.exports = {
    connectDB,
    getDB: () => db,

    // Warn functions
    addWarn: async (guildId, userId, reason, moderator) => {
        await db.execute(
            'INSERT INTO warns (guildId, userId, reason, moderator, time) VALUES (?, ?, ?, ?, ?)',
            [guildId, userId, reason, moderator, Date.now()]
        );
    },

    getWarns: async (guildId, userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM warns WHERE guildId = ? AND userId = ? ORDER BY time DESC',
            [guildId, userId]
        );
        return rows;
    },

    // Blacklist functions
    addBlacklist: async (guildId, userId, reason, byUser) => {
        await db.execute(
            `INSERT INTO blacklist (guildId, userId, reason, time, byUser) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE reason = VALUES(reason), time = VALUES(time), byUser = VALUES(byUser)`,
            [guildId, userId, reason, Date.now(), byUser]
        );
    },

    removeBlacklist: async (guildId, userId) => {
        const [result] = await db.execute(
            'DELETE FROM blacklist WHERE guildId = ? AND userId = ?',
            [guildId, userId]
        );
        return result.affectedRows > 0;
    }
};