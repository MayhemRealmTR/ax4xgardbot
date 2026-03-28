const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'servers',
    execute: async (message) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const guilds = message.client.guilds.cache;

        const container = new ContainerBuilder().setAccentColor(0x7289DA);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📊 Bot is in ${guilds.size} servers**`));

        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

        let list = "";
        guilds.forEach(g => {
            list += `**${g.name}** (${g.id}) — ${g.memberCount} members\n`;
        });

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(list || "No servers"));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};