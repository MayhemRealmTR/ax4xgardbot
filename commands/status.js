const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'status',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const type = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');

        if (!type || !text) {
            return message.reply("usage: `a$status <playing|watching|listening|competing> <text>`");
        }

        let activityType;
        switch (type) {
            case 'playing': activityType = 0; break;
            case 'watching': activityType = 3; break;
            case 'listening': activityType = 2; break;
            case 'competing': activityType = 5; break;
            default: return message.reply("invalid status type.");
        }

        message.client.user.setActivity(text, { type: activityType });

        const container = new ContainerBuilder().setAccentColor(0x00FF00);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Status updated to:** ${type} ${text}`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};