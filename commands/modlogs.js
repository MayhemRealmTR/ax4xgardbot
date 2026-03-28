const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'modlogs',
    execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;

        try {
            // Get warns from database
            const warns = await message.client.db.getWarns(message.guild.id, target.id);

            const container = new ContainerBuilder()
                .setAccentColor(0x7289DA);

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**📋 Mod Logs for ${target.tag}**`)
            );

            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
            );

            if (warns.length === 0) {
                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("No moderation records found.")
                );
            } else {
                let logText = "";
                warns.slice(0, 10).forEach((warn, i) => {  // Show max 10
                    const time = Math.floor(warn.time / 1000);
                    logText += `**${i+1}.** ${warn.reason}\n**Mod:** ${warn.moderator}\n**Time:** <t:${time}:R>\n\n`;
                });

                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(logText)
                );
                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`**Total Warns:** ${warns.length}`)
                );
            }

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[MODLOGS ERROR]", error);
            message.reply("failed to fetch mod logs");
        }
    }
};