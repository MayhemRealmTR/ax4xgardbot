const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'role',
    execute: async (message, args) => {
        if (!message.member.permissions.has("ManageRoles")) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ No Permission**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`You need **Manage Roles** permission.`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        if (args.length < 2) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$role <role1,role2,...> <user>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$role owner,mod @veil\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const fullArgs = args.join(' ');
        const rolePart = fullArgs.split(/\s+(?=\S+$)/)[0];
        const userQuery = fullArgs.split(/\s+(?=\S+$)/)[1];

        const roleNames = rolePart.split(',').map(r => r.trim().replace(/^"|"$/g, ''));

        const target = resolveUser(message.guild, userQuery);
        if (!target) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ User Not Found**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Could not find that user.`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        const added = [];
        const removed = [];

        for (const name of roleNames) {
            const role = resolveRole(message.guild, name);
            if (!role) continue;

            if (target.roles.cache.has(role.id)) {
                await target.roles.remove(role).catch(() => {});
                removed.push(role.name);
            } else {
                await target.roles.add(role).catch(() => {});
                added.push(role.name);
            }
        }

        const container = new ContainerBuilder().setAccentColor(0x7289DA);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Role Action Complete**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User:** ${target.user.tag} (${target.id})`));

        if (added.length > 0) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Added:** ${added.join(', ')}`));
        }
        if (removed.length > 0) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Removed:** ${removed.join(', ')}`));
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};

// Resolvers (kept from your original)
function resolveRole(guild, query) {
    if (!query) return null;
    query = query.toLowerCase();
    const mention = query.match(/<@&(\d+)>/);
    if (mention) return guild.roles.cache.get(mention[1]);
    if (/^\d{17,19}$/.test(query)) return guild.roles.cache.get(query);
    return guild.roles.cache
        .filter(r => r.name.toLowerCase().includes(query))
        .sort((a, b) => b.position - a.position)[0] || null;
}

function resolveUser(guild, query) {
    if (!query) return null;
    query = query.toLowerCase();
    const mention = query.match(/<@!?(\d+)>/);
    if (mention) return guild.members.cache.get(mention[1]);
    if (/^\d{17,19}$/.test(query)) return guild.members.cache.get(query);
    return guild.members.cache
        .filter(m => m.user.username.toLowerCase().includes(query) || m.displayName.toLowerCase().includes(query))
        .sort((a, b) => b.roles.highest.position - a.roles.highest.position)[0] || null;
}