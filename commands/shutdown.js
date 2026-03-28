const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'shutdown',
    execute: async (message) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const container = new ContainerBuilder().setAccentColor(0xFF0000);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent("**Shutting down...**"));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });

        console.log(chalk.red("[SHUTDOWN] Bot shutting down by owner request."));
        process.exit(0);
    }
};