const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'howgay',
    execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;
        const percentage = Math.floor(Math.random() * 101);

        let emoji = percentage > 90 ? "🌈" : percentage < 20 ? "😎" : "🏳️‍🌈";

        const container = new ContainerBuilder()
            .setAccentColor(0xFF69B4);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Gay nigga meter**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${target.id}> is **${percentage}%** gay ${emoji}`));

        if (percentage >= 80) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**bro might just be path**`));
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};