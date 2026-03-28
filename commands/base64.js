const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'base64',
    execute: async (message, args) => {
        const mode = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');

        if (!mode || !['encode', 'decode'].includes(mode) || !text) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$base64 encode <text>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$base64 decode <base64>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        let result = "";
        try {
            if (mode === 'encode') {
                result = Buffer.from(text).toString('base64');
            } else {
                result = Buffer.from(text, 'base64').toString('utf-8');
            }
        } catch (e) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Invalid Input**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`The input is not valid for this operation.`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        const container = new ContainerBuilder()
            .setAccentColor(0xAA00FF);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🔢 Base64 ${mode.charAt(0).toUpperCase() + mode.slice(1)}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Input:** ${text}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Result:** ${result}`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};