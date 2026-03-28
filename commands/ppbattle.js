const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'ppbattle',
    execute: async (message, args) => {
        const user1 = message.mentions.users.first() || message.author;
        const user2 = message.mentions.users.size > 1 
            ? Array.from(message.mentions.users.values())[1] 
            : message.author;

        const size1 = Math.floor(Math.random() * 25) + 5;
        const size2 = Math.floor(Math.random() * 25) + 5;

        const winner = size1 > size2 ? user1 : user2;

        const container = new ContainerBuilder()
            .setAccentColor(0xFF00FF);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**PP Battle**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${user1.id}>: 8${"=".repeat(size1)}D **(${size1}cm)**`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${user2.id}>: 8${"=".repeat(size2)}D **(${size2}cm)**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Winner:** <@${winner.id}>`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};