const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'sendto',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const channelId = args[0];
        const text = args.slice(1).join(' ');

        if (!channelId || !text) {
            return message.reply("usage: `a$sendto <channel_id> <message>`");
        }

        const channel = message.client.channels.cache.get(channelId);
        if (!channel) return message.reply("channel not found.");

        try {
            await channel.send(text);
            message.reply(`✅ Message sent to channel ${channelId}`);
        } catch (error) {
            message.reply("failed to send message.");
        }
    }
};