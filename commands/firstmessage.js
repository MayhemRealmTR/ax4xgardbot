const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'firstmessage',
    execute: async (message) => {
        const channel = message.mentions.channels.first() || message.channel;

        try {
            const messages = await channel.messages.fetch({ limit: 1, after: '0' });
            const first = messages.first();

            if (!first) {
                const err = new ContainerBuilder().setAccentColor(0xFF0000);
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Not Found**`));
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Couldn't find the first message in that channel.`));
                return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
            }

            const container = new ContainerBuilder().setAccentColor(0x7289DA);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📜 First Message in #${channel.name}**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Author:** ${first.author.tag}`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Content:** ${first.content || '*No text content*'}`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Sent:** <t:${Math.floor(first.createdTimestamp / 1000)}:R>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Jump:** [Click here](${first.url})`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[FIRSTMESSAGE ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Failed to fetch the first message.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};