const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'pp',
    execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;
        const size = Math.floor(Math.random() * 25) + 1;
        const pp = "=".repeat(size) + "D";

        const container = new ContainerBuilder()
            .setAccentColor(0xFF00FF);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**PP Size Machine**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${target.id}>'s PP size:`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`8${pp}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Length:** ${size} inches`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};