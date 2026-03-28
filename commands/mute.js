const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'mute',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ModerateMembers'))
            return message.reply("you don't have mod perms pussy");

        const target = message.mentions.members.first();
        if (!target) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$mute @user [time] [reason]`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$mute @user 1h spam\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const timeInput = args[1] || "1h";
        const reason = args.slice(2).join(' ') || "No reason provided";

        const durationMs = parseDuration(timeInput);
        if (!durationMs) {
            const err = new ContainerBuilder().setAccentColor(0xFFAA00);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Invalid Time**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Use: 1h, 30m, 2d...`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        try {
            await target.timeout(durationMs, reason);

            const container = new ContainerBuilder()
                .setAccentColor(0xFFAA00);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🔇 Member Muted**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> muted <@${target.id}>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Duration:** ${timeInput}`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[MUTE ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Couldn't mute that user (higher role or missing perms).`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
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