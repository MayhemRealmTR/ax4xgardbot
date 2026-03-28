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
    name: 'channelsinserver',
    execute: async (message, args) => {
        if (message.author.id !== '1166477548557971560') {
            return message.reply("only the bot developer can use this command.");
        }

        const guildId = args[0];
        const searchQuery = args.slice(1).join(' ').toLowerCase().trim();

        if (!guildId) return message.reply("usage: `a$channelsinserver <server_id> [search]`");

        const guild = message.client.guilds.cache.get(guildId);
        if (!guild) return message.reply("bot is not in that server or invalid ID.");

        let channels = Array.from(guild.channels.cache.values())
            .sort((a, b) => (a.position || 0) - (b.position || 0));

        if (searchQuery) {
            channels = channels.filter(c => c.name.toLowerCase().includes(searchQuery));
        }

        const perPage = 15; // Compact
        let currentPage = 0;

        const getEmoji = (c) => {
            if (c.type === 4) return "📁";
            if (c.type === 2) return "🔊";
            if (c.type === 5) return "📢";
            return "💬";
        };

        const generatePage = (page) => {
            const start = page * perPage;
            const pageCh = channels.slice(start, start + perPage);

            let list = "";
            pageCh.forEach(c => {
                const name = c.name.length > 25 ? c.name.slice(0, 22) + "..." : c.name;
                list += `${getEmoji(c)} **${name}**\n> ${c.id}\n\n`;
            });

            const container = new ContainerBuilder().setAccentColor(0x7289DA);

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**📋 ${guild.name}**`)
            );

            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
            );

            const title = searchQuery 
                ? `**"${searchQuery}"** • ${channels.length} results` 
                : `**Channels:** ${channels.length}`;

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${title} | Page ${page + 1}/${Math.ceil(channels.length / perPage) || 1}`)
            );

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(list || "No channels found.")
            );

            return container;
        };

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('c_prev').setLabel('◀').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('c_next').setLabel('▶').setStyle(ButtonStyle.Secondary)
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
            if (i.customId === 'c_prev') currentPage--;
            if (i.customId === 'c_next') currentPage++;

            const total = Math.ceil(channels.length / perPage) || 1;
            if (currentPage < 0) currentPage = total - 1;
            if (currentPage >= total) currentPage = 0;

            await i.update({ components: [generatePage(currentPage), buttonRow] });
        });

        collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));
    }
};