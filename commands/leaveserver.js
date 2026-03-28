const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'leaveserver',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const guildId = args[0];
        if (!guildId) return message.reply("provide a server ID.");

        const guild = message.client.guilds.cache.get(guildId);
        if (!guild) return message.reply("bot is not in that server or invalid ID.");

        try {
            await guild.leave();
            message.reply(`✅ Left server: **${guild.name}**`);
        } catch (error) {
            message.reply("failed to leave server.");
        }
    }
};