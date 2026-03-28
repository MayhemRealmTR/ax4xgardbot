const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'unlock',
    execute: async (message) => {
        if (!message.member.permissions.has('ManageChannels'))
            return message.reply("you don't have permission to unlock channels");

        try {
            await message.channel.permissionOverwrites.edit(message.guild.id, {
                SendMessages: null
            });

            const container = new ContainerBuilder()
                .setAccentColor(0x00FF00);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🔓 Channel Unlocked**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`This channel has been unlocked by <@${message.author.id}>`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[UNLOCK ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Failed to unlock the channel.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};