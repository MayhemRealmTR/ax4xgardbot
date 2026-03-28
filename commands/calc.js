const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'calc',
    execute: async (message, args) => {
        const expression = args.join(' ');
        if (!expression) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$calc <expression>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$calc 2 + 3 * 5\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        try {
            const result = Function('"use strict";return (' + expression + ')')();

            const container = new ContainerBuilder()
                .setAccentColor(0x00FFAA);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🧮 Calculator**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Expression:** ${expression}`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Result:** ${result}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Invalid Expression**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`The math expression you entered is invalid.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};