const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'usage',
    execute: async (message, args) => {
        if (!args[0]) {
            const container = new ContainerBuilder().setAccentColor(0xFFAA00);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$usage <command>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$usage blacklist\``));
            return message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        const cmdName = args[0].toLowerCase();
        const command = message.client.commands.get(cmdName);

        if (!command) {
            const container = new ContainerBuilder().setAccentColor(0xFF0000);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Not Found**`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Command **${cmdName}** does not exist.`));
            return message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        const container = new ContainerBuilder().setAccentColor(0x7289DA);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📋 Command Usage**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Command:** a$${cmdName}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Check the command or use \`a$help ${cmdName}\` for more info.`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};