const { ContainerBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'rolecolor',
    execute: async (message, args) => {
        if (!message.member.permissions.has("ManageRoles")) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ No Permission**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`You need **Manage Roles** permission.`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        const role = resolveRole(message.guild, args[0]);
        const hex = args[1];

        if (!role || !hex) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$rolecolor <role> <hex>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$rolecolor mod #ff00ff\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        try {
            await role.setColor(hex);
            const container = new ContainerBuilder().setAccentColor(parseInt(hex.replace('#', ''), 16) || 0x7289DA);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Role Color Updated**`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${role.name}** → #${hex.replace('#', '')}`));

            await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        } catch (e) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Invalid hex color or missing permissions.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
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
        .sort((a, b) => b.position - a.position)[0] || null;
}