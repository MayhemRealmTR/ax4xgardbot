const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'permissions',
    execute: async (message, args) => {
        const target = message.mentions.members.first() || message.member;

        const perms = target.permissions.toArray();

        const formatted = perms
            .map(p => `• ${p.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}`)
            .join('\n');

        const container = new ContainerBuilder().setAccentColor(0x7289DA);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**🔐 Permissions — ${target.user.tag}**`)
        );

        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

        if (target.permissions.has('Administrator')) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`👑 **Administrator** — has all permissions`)
            );
        } else {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(formatted || 'No notable permissions.')
            );
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
