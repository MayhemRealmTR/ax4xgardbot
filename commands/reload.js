const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'reload',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot owner can use this command.");
        }

        if (!args[0]) {
            return message.reply("provide a command name to reload.\nExample: `a$reload help`");
        }

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);

        if (!command) {
            return message.reply(`Command **${commandName}** not found.`);
        }

        const commandPath = path.join(__dirname, `${commandName}.js`);

        if (!fs.existsSync(commandPath)) {
            return message.reply(`File for command **${commandName}** not found.`);
        }

        try {
            // Delete from cache
            delete require.cache[require.resolve(commandPath)];

            // Reload command
            const newCommand = require(commandPath);
            message.client.commands.set(commandName, newCommand);

            const container = new ContainerBuilder().setAccentColor(0x00FF00);
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**✅ Command Reloaded**`)
            );
            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
            );
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**a$${commandName}** has been reloaded successfully.`)
            );

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error(error);
            message.reply(`Failed to reload **${commandName}**.`);
        }
    }
};