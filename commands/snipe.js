const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'snipe',
    execute: async (message) => {
        if (!message.client.snipes) message.client.snipes = new Map();

        const snipe = message.client.snipes.get(message.channel.id);

        if (!snipe) {
            const container = new ContainerBuilder().setAccentColor(0xFF5555);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Nothing to snipe**`));
            return message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        const container = new ContainerBuilder()
            .setAccentColor(0xFF5555);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🔫 Sniped Message**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Author:** ${snipe.author.tag}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Message:** ${snipe.content || "*No text content*"}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Time:** <t:${Math.floor(snipe.time/1000)}:R>`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};