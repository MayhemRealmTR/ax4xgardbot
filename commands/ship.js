const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'ship',
    execute: async (message, args) => {
        const users = message.mentions.users;
        if (users.size < 2) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$ship @user1 @user2`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const user1 = Array.from(users.values())[0];
        const user2 = Array.from(users.values())[1];

        const percentage = Math.floor(Math.random() * 101);
        let shipName = user1.username.slice(0, 3) + user2.username.slice(-3);
        let messageText = percentage >= 90 ? "just get married bro" :
                         percentage >= 70 ? "maybe a cheek kiss" :
                         percentage >= 40 ? "not bad" : "one of them prolly gay";

        const container = new ContainerBuilder()
            .setAccentColor(percentage > 70 ? 0xFF69B4 : 0x7289DA);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Shipping ${user1.username} × ${user2.username}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Ship Name:** ${shipName}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Compatibility:** **${percentage}%**`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(messageText));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};