const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'boosters',
    execute: async (message) => {
        await message.guild.members.fetch();

        const boosters = message.guild.members.cache
            .filter(m => m.premiumSince)
            .sort((a, b) => a.premiumSinceTimestamp - b.premiumSinceTimestamp);

        const container = new ContainerBuilder().setAccentColor(0xFF73FA);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**💎 Server Boosters — ${message.guild.name}**`)
        );

        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

        if (boosters.size === 0) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`No boosters yet. Be the first! 💎`)
            );
        } else {
            let list = "";
            boosters.forEach(m => {
                const since = Math.floor(m.premiumSinceTimestamp / 1000);
                list += `💎 **${m.user.tag}**\n> Boosting since <t:${since}:R>\n\n`;
            });

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(list)
            );

            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
            );

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**Total Boosters:** ${boosters.size}`)
            );
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
