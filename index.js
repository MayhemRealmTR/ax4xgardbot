const { Client, GatewayIntentBits, Collection } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const botstatus = require('./botstatus');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Share client globally so dashboard can access real data without duplicating bot
global.botClient = client;

client.commands = new Collection();
const prefix = 'a$';

console.log(chalk.magenta("=== AXGARD BOT STARTING UP ===\n"));

// Database
const dbModule = require('./database');
client.db = dbModule;

(async () => {
    await dbModule.connectDB();
})();

// In-memory storage
client.snipes = new Map();
client.afk = new Map();
client.maintenance = false;
client.errorLogs = [];

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
    console.log(chalk.green("[LOADED]") + " " + command.name);
}

client.once('ready', () => {
    botstatus.applyStatus(client);
    console.log(chalk.cyan("\nAXGARD IS NOW ONLINE"));
    console.log(chalk.white("Prefix: ") + chalk.red(prefix));
    console.log(chalk.white("Servers: ") + chalk.green(client.guilds.cache.size));
    console.log(chalk.white("Users: ") + chalk.green(client.users.cache.size) + "\n");
    // Signal to dashboard that bot is fully ready
    if (process.send) process.send('BOT_READY');
});

// ====================== MESSAGE HANDLER ======================
client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    // Maintenance mode
    if (message.client.maintenance && message.author.id !== '1166477548557971560') {
        return message.reply("bot is currently in maintenance mode.");
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    let commandName = args.shift().toLowerCase();

    const runCommand = (finalCommandName) => {
        const command = client.commands.get(finalCommandName);
        if (!command) return;

        console.log(chalk.blue("[COMMAND]") + ` ${message.author.tag} used a$${finalCommandName}`);

        // ====================== AUTO USAGE SYSTEM ======================
        const commandsNeedingArgs = [
            'blacklist', 'unblacklist', 'warn', 'kick', 'mute', 'unmute', 'verify',
            'nick', 'role', 'rolecolor', 'roleabove', 'rolehoist', 'removerole',
            'slowmode', 'timestamp', 'translate', 'qrcode', 'base64', 'calc',
            'remind', 'ship', 'pedometer', 'niggameter', 'goonmeter', 'femboymeter',
            'cuckmeter', 'setup', 'addalias', 'removealias', 'purge', 'botclear',
            'lock', 'unlock', 'firstmessage', 'convertuserid', 'robloxuser',
            'robloxavatar'
        ];

        if (commandsNeedingArgs.includes(finalCommandName)) {
            const hasMention = message.mentions.users.size > 0 || message.mentions.members.size > 0;
            const hasArgs = args.length > 0;

            if (!hasMention && !hasArgs) {
                const usageContainer = new ContainerBuilder().setAccentColor(0xFFAA00);
                usageContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Missing Arguments**`));
                usageContainer.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
                usageContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Command: \`a$${finalCommandName}\``));
                usageContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Use \`a$usage ${finalCommandName}\` for proper usage`));
                
                return message.channel.send({
                    components: [usageContainer],
                    flags: MessageFlags.IsComponentsV2
                });
            }
        }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(chalk.red("[ERROR]") + ` ${finalCommandName}:`, error);

            client.errorLogs.push({
                time: Date.now(),
                command: finalCommandName,
                error: error.message || error.toString()
            });
            if (client.errorLogs.length > 50) client.errorLogs.shift();

            message.reply('some shit broke while running that command 💀').catch(() => {});
        }
    };

    // Alias support
    if (message.client.db) {
        message.client.db.getDB().execute(
            'SELECT command FROM aliases WHERE guildId = ? AND alias = ?',
            [message.guild.id, commandName]
        ).then(([rows]) => {
            if (rows.length > 0) {
                runCommand(rows[0].command);
            } else {
                runCommand(commandName);
            }
        }).catch(() => runCommand(commandName));
    } else {
        runCommand(commandName);
    }
});

// ====================== SNIPE SUPPORT ======================
client.on('messageDelete', message => {
    if (message.author.bot) return;
    client.snipes.set(message.channel.id, {
        author: message.author,
        content: message.content,
        time: Date.now()
    });
});

// ====================== INTERACTION HANDLER (for setup) ======================
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit() || !interaction.customId.startsWith('setup_verification_')) return;

    const verifiedStr = interaction.fields.getTextInputValue('verified_role').trim();
    const unverifiedStr = interaction.fields.getTextInputValue('unverified_role').trim();

    const resolveRole = (guild, str) => {
        if (!str || str.toLowerCase() === 'none') return null;
        if (/^\d{17,19}$/.test(str)) return guild.roles.cache.get(str);
        return guild.roles.cache.find(r => 
            r.name.toLowerCase() === str.toLowerCase() || 
            r.name.toLowerCase().includes(str.toLowerCase())
        ) || null;
    };

    const verifiedRole = resolveRole(interaction.guild, verifiedStr);
    if (!verifiedRole) {
        return interaction.reply({ content: "❌ Could not find Verified Role by that name or ID.", ephemeral: true });
    }

    try {
        await interaction.client.db.getDB().execute(`
            CREATE TABLE IF NOT EXISTS server_config (
                guildId VARCHAR(30) NOT NULL,
                key_name VARCHAR(50) NOT NULL,
                value VARCHAR(100) NOT NULL,
                PRIMARY KEY (guildId, key_name)
            )
        `);

        await interaction.client.db.getDB().execute(
            `INSERT INTO server_config (guildId, key_name, value) 
             VALUES (?, 'verified_role', ?) ON DUPLICATE KEY UPDATE value = VALUES(value)`,
            [interaction.guild.id, verifiedRole.id]
        );

        const unverifiedRole = resolveRole(interaction.guild, unverifiedStr);
        if (unverifiedRole) {
            await interaction.client.db.getDB().execute(
                `INSERT INTO server_config (guildId, key_name, value) 
                 VALUES (?, 'unverified_role', ?) ON DUPLICATE KEY UPDATE value = VALUES(value)`,
                [interaction.guild.id, unverifiedRole.id]
            );
        }

        const container = new ContainerBuilder().setAccentColor(0x00FF00);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Verification Setup Complete**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Verified Role:** <@&${verifiedRole.id}>`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Unverified Role:** ${unverifiedRole ? `<@&${unverifiedRole.id}>` : 'None'}`));

        await interaction.reply({ 
            components: [container], 
            flags: MessageFlags.IsComponentsV2 
        });

    } catch (error) {
        console.error("[SETUP ERROR]", error);
        await interaction.reply({ content: "Database error 💀", ephemeral: true });
    }
});

client.login(process.env.TOKEN);