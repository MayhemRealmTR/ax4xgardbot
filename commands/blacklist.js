const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'blacklist',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ModerateMembers'))
            return message.reply("you don't have mod perms pussy");

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$blacklist @user [reason]`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const reason = args.slice(1).join(' ') || 'No reason provided.';
        const userId = target.id || target.user?.id;

        try {
            await message.client.db.addBlacklist(
                message.guild.id,
                userId,
                reason,
                message.author.tag
            );

            const container = new ContainerBuilder()
                .setAccentColor(0xFF0000);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ User Blacklisted**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> blacklisted <@${userId}>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`By ${message.author.tag}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[BLACKLIST ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Error**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Database error while blacklisting.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};