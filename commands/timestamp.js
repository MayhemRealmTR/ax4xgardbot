const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'timestamp',
    execute: async (message, args) => {
        const timeInput = args.join(' ');
        if (!timeInput) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$timestamp <time>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$timestamp 2h 30m\` or \`a$timestamp now\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        let timestamp = Math.floor(Date.now() / 1000);

        if (timeInput.toLowerCase() !== "now") {
            const match = timeInput.match(/(\d+)([hmd])/i);
            if (match) {
                const num = parseInt(match[1]);
                const unit = match[2].toLowerCase();
                if (unit === 'h') timestamp += num * 3600;
                if (unit === 'd') timestamp += num * 86400;
                if (unit === 'm') timestamp += num * 60;
            }
        }

        const container = new ContainerBuilder()
            .setAccentColor(0x5865F2);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⏰ Discord Timestamp**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<t:${timestamp}:F>`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<t:${timestamp}:R>`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};