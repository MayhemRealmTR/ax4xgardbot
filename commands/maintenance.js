const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'maintenance',
    execute: async (message) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const current = message.client.maintenance || false;
        message.client.maintenance = !current;

        const status = message.client.maintenance ? "**enabled**" : "**disabled**";

        const container = new ContainerBuilder().setAccentColor(message.client.maintenance ? 0xFF0000 : 0x00FF00);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Maintenance mode ${status}**`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};