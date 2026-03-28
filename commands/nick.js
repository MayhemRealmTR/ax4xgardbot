const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'nick',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageNicknames'))
            return message.reply("you don't have permission to change nicknames");

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$nick @user <new nick>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const newNick = args.slice(1).join(' ').trim();
        if (!newNick) return message.reply("provide a new nickname.");

        try {
            await target.setNickname(newNick);

            const container = new ContainerBuilder().setAccentColor(0x00FF00);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Nickname Changed**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User:** ${target.user.tag}`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**New Nick:** ${newNick}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            message.reply("failed to change nickname (higher role or missing perms).");
        }
    }
};
