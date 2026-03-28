const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'warns',
    execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;

        try {
            const warns = await message.client.db.getWarns(message.guild.id, target.id);

            if (warns.length === 0) {
                const container = new ContainerBuilder().setAccentColor(0xFFFF00);
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ No Warns**`));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${target.id}> has no warns in this server.`));
                return message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
            }

            const container = new ContainerBuilder()
                .setAccentColor(0xFFFF00);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Warns for ${target.tag}**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

            let desc = "";
            warns.forEach((warn, i) => {
                const time = Math.floor(warn.time / 1000);
                desc += `**${i+1}.** ${warn.reason}\n**Mod:** ${warn.moderator}\n**Time:** <t:${time}:R>\n\n`;
            });

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(desc));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Total Warns: **${warns.length}**`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[WARNS ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Error**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Database error while fetching warns.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};