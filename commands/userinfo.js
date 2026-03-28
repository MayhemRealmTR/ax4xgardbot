const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'userinfo',
    execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(target.id);

        const container = new ContainerBuilder()
            .setAccentColor(0x7289DA);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**👤 User Info - ${target.tag}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**ID:** ${target.id}`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Account Created:** <t:${Math.floor(target.createdTimestamp/1000)}:R>`));

        if (member) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Joined Server:** <t:${Math.floor(member.joinedTimestamp/1000)}:R>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Roles:** ${member.roles.cache.size - 1}`));
        }

        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Requested by <@${message.author.id}>`));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};