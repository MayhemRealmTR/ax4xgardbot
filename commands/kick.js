const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'kick',
    execute: async (message, args) => {
        if (!message.member.permissions.has('KickMembers'))
            return message.reply("you don't have kick permissions pussy");

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$kick @user [reason]`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const reason = args.slice(1).join(' ') || "No reason provided";

        try {
            await target.kick(reason);

            const container = new ContainerBuilder()
                .setAccentColor(0xFF4500);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**👢 Member Kicked**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${message.author.id}> kicked <@${target.id}>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Reason:** ${reason}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[KICK ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`I couldn't kick that user (higher role or missing perms).`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};