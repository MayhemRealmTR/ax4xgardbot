const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'addalias',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        if (args.length < 2) {
            return message.reply("usage: `a$addalias <command> <alias>`\nExample: `a$addalias blacklist bl`");
        }

        const commandName = args[0].toLowerCase();
        const alias = args[1].toLowerCase();

        const command = message.client.commands.get(commandName);
        if (!command) {
            return message.reply(`command **${commandName}** not found.`);
        }

        try {
            await message.client.db.query(`
                CREATE TABLE IF NOT EXISTS aliases (
                    guildId VARCHAR(30) NOT NULL,
                    command VARCHAR(50) NOT NULL,
                    alias VARCHAR(50) NOT NULL,
                    PRIMARY KEY (guildId, alias)
                )
            `);

            await message.client.db.query(
                'INSERT INTO aliases (guildId, command, alias) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE command = ?',
                [message.guild.id, commandName, alias, commandName]
            );

            const container = new ContainerBuilder().setAccentColor(0x00FF00);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Alias Added**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${alias}** is now an alias for **${commandName}** in this server`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error(error);
            message.reply("failed to add alias.");
        }
    }
};