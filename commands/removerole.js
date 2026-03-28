const { ContainerBuilder, TextDisplayBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'removerole',
    execute: async (message, args) => {
        if (!message.member.permissions.has("ManageRoles")) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ No Permission**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`You need **Manage Roles** permission.`));
            return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }

        const role = resolveRole(message.guild, args[0]);
        if (!role) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$removerole <role>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const container = new ContainerBuilder().setAccentColor(0xFF0000);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Delete Role?**`));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${role.name}**`));

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('role_delete_yes').setLabel('Delete').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('role_delete_no').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
        );

        const msg = await message.channel.send({ components: [container, row], flags: MessageFlags.IsComponentsV2 });

        const collector = msg.createMessageComponentCollector({ time: 15000, filter: i => i.user.id === message.author.id });

        collector.on('collect', async i => {
            if (i.customId === 'role_delete_yes') {
                await role.delete().catch(() => {});
                await i.update({ content: `✅ Role **${role.name}** deleted.`, components: [] });
            } else {
                await i.update({ content: "Cancelled.", components: [] });
            }
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
        .sort((a, b) => b.position - a.position)[0] || null;
}