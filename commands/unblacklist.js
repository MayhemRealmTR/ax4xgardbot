const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'unblacklist',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ModerateMembers'))
            return message.reply("you don't have mod perms pussy");

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$unblacklist @user [reason]`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const reason = args.slice(1).join(' ') || 'No reason provided.';
        const userId = target.id || target.user?.id;

        try {
            const removed = await message.client.db.removeBlacklist(message.guild.id, userId);

            if (removed) {
                const container = new ContainerBuilder()
                    .setAccentColor(0x00FF00);

                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ User Unblacklisted**`));
                container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> unblacklisted <@${userId}>`));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}`));
                container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`By ${message.author.tag}`));

                await message.channel.send({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });
            } else {
                const err = new ContainerBuilder().setAccentColor(0xFFAA00);
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Not Blacklisted**`));
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`That user is not blacklisted in this server.`));
                await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
            }
        } catch (error) {
            console.error("[UNBLACKLIST ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Error**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Database error while unblacklisting.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};