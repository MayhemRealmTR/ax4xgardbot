const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

module.exports = {
    name: 'rolecolor',
    execute: async (message, args) => {
        if (!message.member.permissions.has("ManageRoles")) {
            return message.reply("you need `Manage Roles` permission.");
        }

        const role = resolveRole(message.guild, args[0]);
        const hex = args[1];

        if (!role || !hex) return message.reply("usage: `a$rolecolor <role/own/mod> <hex>`");

        try {
            await role.setColor(hex);
            const container = new ContainerBuilder().setAccentColor(parseInt(hex.replace('#', ''), 16) || 0x7289DA);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Role color updated**`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${role.name}** → #${hex.replace('#', '')}`));
            await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        } catch (e) {
            message.reply("invalid hex color or missing permissions.");
        }
    }
};

// Helper (copy to all role commands)
function resolveRole(guild, query) {
    if (!query) return null;
    query = query.toLowerCase();

    // Mention or ID
    const mentionMatch = query.match(/<@&(\d+)>/);
    if (mentionMatch) return guild.roles.cache.get(mentionMatch[1]);

    // ID
    if (/^\d{17,19}$/.test(query)) return guild.roles.cache.get(query);

    // Shortcuts
    const shortcuts = {
        'own': 'owner',
        'mod': 'moderator',
        'admin': 'administrator',
        'mute': 'muted',
        'staff': 'staff'
    };
    const shortcut = shortcuts[query] || query;

    // Find by name (case insensitive)
    return guild.roles.cache.find(r => 
        r.name.toLowerCase() === shortcut || 
        r.name.toLowerCase().includes(shortcut)
    );
}