const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'removealias',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        if (!args[0]) return message.reply("provide an alias to remove.");

        const alias = args[0].toLowerCase();

        try {
            const [result] = await message.client.db.query(
                'DELETE FROM aliases WHERE guildId = ? AND alias = ?',
                [message.guild.id, alias]
            );

            if (result.affectedRows === 0) {
                return message.reply(`Alias **${alias}** not found in this server.`);
            }

            const container = new ContainerBuilder().setAccentColor(0xFF0000);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Alias Removed**`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${alias}** has been removed from this server`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error(error);
            message.reply("failed to remove alias.");
        }
    }
};