const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'dm',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot owner can use this command.");
        }

        const userId = args[0];
        const text = args.slice(1).join(' ');

        if (!userId || !text) {
            return message.reply("usage: `a$dm <user_id> <message>`");
        }

        const user = await message.client.users.fetch(userId).catch(() => null);
        if (!user) return message.reply("user not found.");

        try {
            await user.send(text);
            message.reply(`✅ DM sent to ${user.tag}`);
        } catch (error) {
            message.reply("failed to send DM (user may have DMs disabled).");
        }
    }
};