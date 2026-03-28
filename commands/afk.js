const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'afk',
    execute: async (message, args) => {
        const reason = args.join(' ') || "No reason provided";

        if (!message.client.afk) message.client.afk = new Map();

        message.client.afk.set(message.author.id, {
            reason: reason,
            time: Date.now()
        });

        const container = new ContainerBuilder()
            .setAccentColor(0xFFAA00);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**💤 AFK Mode Enabled**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> is now AFK`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};