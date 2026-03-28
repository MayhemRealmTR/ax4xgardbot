const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'botstats',
    execute: async (message) => {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;

        const container = new ContainerBuilder()
            .setAccentColor(0x00FF88);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📊 Axgard Bot Statistics**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Servers:** ${message.client.guilds.cache.size}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Users:** ${message.client.users.cache.size}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Uptime:** ${days}d ${hours}h ${minutes}m`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Ping:** ${Math.round(message.client.ws.ping)}ms`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};