const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'usersinserver',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot owner can use this command.");
        }

        const guildId = args[0];
        const searchQuery = args.slice(1).join(' ').toLowerCase().trim();

        if (!guildId) return message.reply("usage: `a$usersinserver <server_id> [search]`");

        const guild = message.client.guilds.cache.get(guildId);
        if (!guild) return message.reply("bot is not in that server or invalid ID.");

        await guild.members.fetch();

        let humans = Array.from(guild.members.cache.filter(m => !m.user.bot).values());

        if (searchQuery) {
            humans = humans.filter(m => 
                m.user.username.toLowerCase().includes(searchQuery) ||
                m.displayName.toLowerCase().includes(searchQuery) ||
                m.id.includes(searchQuery)
            );
        }

        humans.sort((a, b) => b.roles.highest.position - a.roles.highest.position);

        const perPage = 18;
        let currentPage = 0;

        const getPerm = (m) => m.permissions.has("Administrator") ? "👑" : m.permissions.has("KickMembers") ? "🛡️" : "👤";

        const generatePage = (page) => {
            const start = page * perPage;
            const pageHumans = humans.slice(start, start + perPage);

            let list = "";
            pageHumans.forEach(m => {
                const name = m.displayName.length > 22 ? m.displayName.slice(0, 19) + "..." : m.displayName;
                list += `${getPerm(m)} **${name}**\n> ${m.user.username} • ${m.id}\n\n`;
            });

            const container = new ContainerBuilder().setAccentColor(0x7289DA);

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**👥 ${guild.name}**`)
            );

            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
            );

            const title = searchQuery 
                ? `**"${searchQuery}"** • ${humans.length} results` 
                : `**Humans:** ${humans.length}`;

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${title} | Page ${page + 1}/${Math.ceil(humans.length / perPage) || 1}`)
            );

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(list || "No users found.")
            );

            return container;
        };

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('u_prev').setLabel('◀').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('u_next').setLabel('▶').setStyle(ButtonStyle.Secondary)
        );

        const msg = await message.channel.send({
            components: [generatePage(currentPage), buttonRow],
            flags: MessageFlags.IsComponentsV2
        });

        const collector = msg.createMessageComponentCollector({ 
            time: 60000, 
            filter: i => i.user.id === message.author.id 
        });

        collector.on('collect', async i => {
            if (i.customId === 'u_prev') currentPage--;
            if (i.customId === 'u_next') currentPage++;

            const total = Math.ceil(humans.length / perPage) || 1;
            if (currentPage < 0) currentPage = total - 1;
            if (currentPage >= total) currentPage = 0;

            await i.update({ components: [generatePage(currentPage), buttonRow] });
        });

        collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));
    }
};