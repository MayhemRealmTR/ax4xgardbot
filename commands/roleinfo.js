const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'roleinfo',
    execute: async (message, args) => {
        const role = resolveRole(message.guild, args.join(' '));
        if (!role) return message.reply("provide a valid role. Example: `a$roleinfo Admin`");

        await message.guild.members.fetch();
        const memberCount = message.guild.members.cache.filter(m => m.roles.cache.has(role.id)).size;
        const created = Math.floor(role.createdTimestamp / 1000);
        const colorHex = role.hexColor === '#000000' ? 'None' : role.hexColor;

        const perms = role.permissions.toArray()
            .map(p => p.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()))
            .slice(0, 8)
            .join(', ');

        const container = new ContainerBuilder().setAccentColor(role.color || 0x7289DA);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**🎭 Role Info — ${role.name}**`)
        );

        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**ID:** ${role.id}`)
        );
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Color:** ${colorHex}`)
        );
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Position:** ${role.position}`)
        );
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Hoisted:** ${role.hoist ? 'Yes' : 'No'}`)
        );
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Mentionable:** ${role.mentionable ? 'Yes' : 'No'}`)
        );
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Members:** ${memberCount}`)
        );
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Created:** <t:${created}:R>`)
        );

        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Key Permissions:** ${perms || 'None'}`)
        );

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};

function resolveRole(guild, query) {
    if (!query) return null;
    query = query.toLowerCase();

    const mention = query.match(/<@&(\d+)>/);
    if (mention) return guild.roles.cache.get(mention[1]);

    if (/^\d{17,19}$/.test(query)) return guild.roles.cache.get(query);

    return guild.roles.cache
        .filter(r => r.name.toLowerCase().includes(query))
        .sort((a, b) => b.position - a.position)
        .first() || null;
}
