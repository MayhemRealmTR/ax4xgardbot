const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'avatar',
    execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;

        const container = new ContainerBuilder()
            .setAccentColor(0x7289DA);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Avatar for ${target.tag}**`)
        );

        await message.channel.send({
            content: target.displayAvatarURL({ size: 1024, dynamic: true }),
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};