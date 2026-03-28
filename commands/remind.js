const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'remind',
    execute: async (message, args) => {
        const timeInput = args[0];
        const reminder = args.slice(1).join(' ');

        if (!timeInput || !reminder) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$remind <time> <reminder>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$remind 1h do homework\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const ms = parseDuration(timeInput);
        if (!ms) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Invalid Time**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Use: 1s, 1m, 1h, 1d`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        if (ms > 7 * 24 * 60 * 60 * 1000) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Limit Exceeded**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Max reminder time is 7 days.`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        const fireAt = Math.floor((Date.now() + ms) / 1000);

        const container = new ContainerBuilder().setAccentColor(0x00FFAA);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⏰ Reminder Set**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reminder:** ${reminder}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Fires:** <t:${fireAt}:R>`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });

        setTimeout(async () => {
            try {
                const reminderContainer = new ContainerBuilder().setAccentColor(0x00FFAA);
                reminderContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⏰ Reminder**`));
                reminderContainer.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
                reminderContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> you asked to be reminded:`));
                reminderContainer.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${reminder}**`));

                await message.channel.send({
                    components: [reminderContainer],
                    flags: MessageFlags.IsComponentsV2
                });
            } catch (e) {}
        }, ms);
    }
};

function parseDuration(str) {
    const match = str.match(/^(\d+)([smhd])$/i);
    if (!match) return null;
    const [, num, unit] = match;
    const n = parseInt(num);
    switch (unit.toLowerCase()) {
        case 's': return n * 1000;
        case 'm': return n * 60 * 1000;
        case 'h': return n * 60 * 60 * 1000;
        case 'd': return n * 24 * 60 * 60 * 1000;
        default: return null;
    }
}