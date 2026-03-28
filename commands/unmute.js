const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'unmute',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ModerateMembers'))
            return message.reply("you don't have mod perms pussy");

        const target = message.mentions.members.first();
        if (!target) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$unmute @user [reason]`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const reason = args.slice(1).join(' ') || "No reason provided";

        try {
            await target.timeout(null, reason);

            const container = new ContainerBuilder()
                .setAccentColor(0x00FF00);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🔊 Member Unmuted**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> unmuted <@${target.id}>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[UNMUTE ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Couldn't unmute that user.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};