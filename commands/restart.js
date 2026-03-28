// restart.js - Fixed for LemonHost / Pterodactyl

const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: 'restart',
    execute: async (message) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const container = new ContainerBuilder()
            .setAccentColor(0xFFAA00);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent("**🔄 Restarting bot...**")
        );
        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent("The bot will restart shortly.")
        );

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });

        console.log(chalk.yellow("[RESTART] Bot restart requested by owner."));

        // Graceful shutdown - let Pterodactyl handle the restart
        setTimeout(() => {
            process.exit(0);   // This tells LemonHost/Pterodactyl to auto-restart
        }, 1500); // small delay so the message sends properly
    }
};