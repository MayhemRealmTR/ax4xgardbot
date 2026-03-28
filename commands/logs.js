const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'logs',
    execute: async (message) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        // Simple in-memory log storage (we'll keep last 20 errors)
        if (!message.client.errorLogs) {
            message.client.errorLogs = [];
        }

        const container = new ContainerBuilder().setAccentColor(0x7289DA);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent("**📜 Recent Bot Logs**")
        );

        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

        if (message.client.errorLogs.length === 0) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent("No recent errors logged yet.")
            );
        } else {
            let logText = "";
            message.client.errorLogs.slice(-15).forEach((log, i) => {  // show last 15
                logText += `**${i+1}.** [${new Date(log.time).toLocaleTimeString()}] ${log.error}\n`;
            });

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(logText)
            );
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};