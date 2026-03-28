const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'warn',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ModerateMembers'))
            return message.reply("you don't have mod perms pussy");

        const target = message.mentions.users.first();
        if (!target) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$warn @user [reason]`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const reason = args.slice(1).join(' ') || "No reason provided";

        try {
            await message.client.db.addWarn(
                message.guild.id,
                target.id,
                reason,
                message.author.tag
            );

            const container = new ContainerBuilder()
                .setAccentColor(0xFFFF00);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Warning Issued**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> warned <@${target.id}>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`By ${message.author.tag}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[WARN ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Error**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Database error while issuing warn.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};