const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'poll',
    execute: async (message, args) => {
        const question = args.join(' ');
        if (!question) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$poll <question>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$poll Should we add more fun commands?\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const container = new ContainerBuilder()
            .setAccentColor(0x5865F2);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📊 Poll**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${question}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`React with ✅ or ❌`));

        const pollMsg = await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });

        await pollMsg.react('✅');
        await pollMsg.react('❌');
    }
};