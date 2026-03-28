const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'blacklistserver',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560')
            return message.reply("only the bot developer can use this command.");

        const subcommand = args[0]?.toLowerCase();
        const guildId = args[1];

        if (!subcommand || !['add', 'remove'].includes(subcommand) || !guildId) {
            return message.reply("usage: `a$blacklistserver add <server_id>` or `a$blacklistserver remove <server_id>`");
        }

        try {
            if (subcommand === 'add') {
                await message.client.db.getDB().execute(
                    `CREATE TABLE IF NOT EXISTS blacklisted_servers (
                        guildId VARCHAR(30) PRIMARY KEY,
                        time BIGINT
                    )`
                );

                await message.client.db.getDB().execute(
                    'INSERT INTO blacklisted_servers (guildId, time) VALUES (?, ?) ON DUPLICATE KEY UPDATE time = VALUES(time)',
                    [guildId, Date.now()]
                );

                const guild = message.client.guilds.cache.get(guildId);
                if (guild) await guild.leave();

                const container = new ContainerBuilder().setAccentColor(0xFF0000);
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🚫 Server Blacklisted**`));
                container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Server ID:** ${guildId}`));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(guild ? `Bot has left the server.` : `Server was not in cache.`));

                await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });

            } else if (subcommand === 'remove') {
                const [result] = await message.client.db.getDB().execute(
                    'DELETE FROM blacklisted_servers WHERE guildId = ?',
                    [guildId]
                );

                const container = new ContainerBuilder().setAccentColor(result.affectedRows > 0 ? 0x00FF00 : 0xFFAA00);
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
                    result.affectedRows > 0 ? `**✅ Server Unblacklisted**` : `**⚠️ Server was not blacklisted**`
                ));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Server ID:** ${guildId}`));

                await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
            }

        } catch (error) {
            console.error("[BLACKLISTSERVER ERROR]", error);
            message.reply("database error 💀");
        }
    }
};
