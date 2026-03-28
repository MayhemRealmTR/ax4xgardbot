const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'listalias',
    execute: async (message) => {
        try {
            const [rows] = await message.client.db.query(
                'SELECT command, alias FROM aliases WHERE guildId = ?',
                [message.guild.id]
            );

            const container = new ContainerBuilder().setAccentColor(0x7289DA);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📋 Alias List**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

            if (rows.length === 0) {
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent("No aliases set in this server."));
            } else {
                let list = "";
                rows.forEach(row => {
                    list += `**${row.alias}** → ${row.command}\n`;
                });
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(list));
            }

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            const container = new ContainerBuilder().setAccentColor(0x7289DA);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📋 Alias List**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent("No aliases set in this server."));
            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }
};