const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'howhot',
    execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;
        const hotness = Math.floor(Math.random() * 101);

        let comment = hotness >= 90 ? "hi lol" :
                     hotness >= 75 ? "baddie yo" :
                     hotness >= 50 ? "mid" : "ugly ass nigga";

        const container = new ContainerBuilder()
            .setAccentColor(0xFF1493);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Hot nigga meter**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${target.id}> is **${hotness}%** hot`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(comment));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};