const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'ping',
    execute: async (message) => {
        const sent = await message.channel.send("Pinging...");

        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);

        const container = new ContainerBuilder()
            .setAccentColor(0x00FF00);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**pong**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Bot Latency:** ${latency}ms`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**API Latency:** ${apiLatency}ms`));

        await sent.edit({
            content: null,
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};