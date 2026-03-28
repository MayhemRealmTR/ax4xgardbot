const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder, 
    ButtonStyle, 
    StringSelectMenuBuilder,
    ActionRowBuilder,
    MessageFlags 
} = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: 'help',
    execute: async (message, args) => {
        try {
            const allCommands = [
                // Moderation
                { name: "warn", desc: "Warn a member", cat: "moderation" },
                { name: "warns", desc: "Show warns of a user", cat: "moderation" },
                { name: "kick", desc: "Kick a member", cat: "moderation" },
                { name: "mute", desc: "Mute a member", cat: "moderation" },
                { name: "unmute", desc: "Unmute a member", cat: "moderation" },
                { name: "slowmode", desc: "Set slowmode in current channel", cat: "moderation" },
                { name: "blacklist", desc: "Blacklist a user", cat: "moderation" },
                { name: "unblacklist", desc: "Remove blacklist from a user", cat: "moderation" },
                { name: "modlogs", desc: "Show moderation logs for a user", cat: "moderation" },
                { name: "lock", desc: "Lock current channel", cat: "moderation" },
                { name: "unlock", desc: "Unlock current channel", cat: "moderation" },
                { name: "purge", desc: "Delete multiple messages", cat: "moderation" },
                { name: "nuke", desc: "Nuke (delete a huge amount of) messages", cat: "moderation" },
                { name: "botclear", desc: "Clear bot messages", cat: "moderation" },
                { name: "nick", desc: "Change a member's nickname", cat: "moderation" },
                { name: "verify", desc: "Verify a member (requires setup)", cat: "moderation" },
                { name: "usage", desc: "Show command usage statistics", cat: "moderation" },
            
                // Roblox
                { name: "robloxuser", desc: "Get Roblox user info", cat: "roblox" },
                { name: "robloxavatar", desc: "Show Roblox avatar", cat: "roblox" },
                { name: "convertuserid", desc: "Convert username ↔ User ID", cat: "roblox" },
            
                // Fun / Meters
                { name: "pp", desc: "PP size machine", cat: "fun" },
                { name: "howgay", desc: "How gay radar", cat: "fun" },
                { name: "howhot", desc: "Rate how hot someone is", cat: "fun" },
                { name: "ppbattle", desc: "PP size battle", cat: "fun" },
                { name: "ship", desc: "Ship two users", cat: "fun" },
                { name: "poll", desc: "Create a simple poll", cat: "fun" },
                { name: "pedometer", desc: "Calculate pedometer %", cat: "fun" },
                { name: "niggameter", desc: "How black & gangsta you are", cat: "fun" },
                { name: "goonmeter", desc: "How much you goon", cat: "fun" },
                { name: "femboymeter", desc: "How much of a femboy you are", cat: "fun" },
                { name: "cuckmeter", desc: "How much of a cuck you are", cat: "fun" },
            
                // Utility
                { name: "userinfo", desc: "Show user information", cat: "utility" },
                { name: "avatar", desc: "Show a user's avatar", cat: "utility" },
                { name: "serverinfo", desc: "Show server information", cat: "utility" },
                { name: "botstats", desc: "Show bot statistics", cat: "utility" },
                { name: "snipe", desc: "Show last deleted message", cat: "utility" },
                { name: "afk", desc: "Set AFK status", cat: "utility" },
                { name: "timestamp", desc: "Convert time to timestamp", cat: "utility" },
                { name: "remind", desc: "Set a reminder", cat: "utility" },
                { name: "calc", desc: "Simple calculator", cat: "utility" },
                { name: "translate", desc: "Translate text", cat: "utility" },
                { name: "qrcode", desc: "Generate QR code", cat: "utility" },
                { name: "base64", desc: "Encode/decode Base64", cat: "utility" },
                { name: "importemojis", desc: "Steal multiple emojis from other servers", cat: "utility" },
                { name: "firstmessage", desc: "Get the first message in a channel", cat: "utility" },
                { name: "permissions", desc: "Show a user's permissions", cat: "utility" },
                { name: "boosters", desc: "List all server boosters", cat: "utility" },
                { name: "setup", desc: "Setup bot features for this server", cat: "utility" },
                { name: "addalias", desc: "Add command alias", cat: "utility" },
                { name: "listalias", desc: "List server aliases", cat: "utility" },
                { name: "removealias", desc: "Remove command alias", cat: "utility" },
                { name: "ping", desc: "Check bot latency and response time", cat: "utility" },
            
                // Role Management
                { name: "roleinfo", desc: "Show info about a role", cat: "utility" },
                { name: "rolecolor", desc: "Change role color", cat: "utility" },
                { name: "createrole", desc: "Create a new role", cat: "utility" },
                { name: "removerole", desc: "Delete a role with confirmation", cat: "utility" },
                { name: "roleabove", desc: "Place role1 above role2", cat: "utility" },
                { name: "rolehoist", desc: "Set role hoist true/false", cat: "utility" },
                { name: "role", desc: "Add/remove roles from user (supports multiple)", cat: "utility" },
            
                // Owner Only
                { name: "shutdown", desc: "Shutdown the bot", cat: "owner" },
                { name: "restart", desc: "Restart the bot", cat: "owner" },
                { name: "leaveserver", desc: "Leave a server by ID", cat: "owner" },
                { name: "servers", desc: "List all servers the bot is in", cat: "owner" },
                { name: "status", desc: "Change bot status", cat: "owner" },
                { name: "maintenance", desc: "Toggle maintenance mode", cat: "owner" },
                { name: "sendto", desc: "Send message to a channel by ID", cat: "owner" },
                { name: "dm", desc: "DM a user by ID", cat: "owner" },
                { name: "logs", desc: "Show recent bot error logs", cat: "owner" },
                { name: "reload", desc: "Reload a command", cat: "owner" },
                { name: "blacklistserver", desc: "Blacklist a server from using the bot", cat: "owner" },
                { name: "usersinserver", desc: "List users in a server by ID", cat: "owner" },
                { name: "channelsinserver", desc: "List channels in a server by ID", cat: "owner" }
            ];

            const totalCommands = allCommands.length;

            const query = args[0] ? args[0].toLowerCase() : null;

            if (query) {
                const cmd = allCommands.find(c => c.name === query);
                if (cmd) {
                    const container = new ContainerBuilder().setAccentColor(0x7289DA);
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Command: a$${cmd.name}**`));
                    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Description:** ${cmd.desc}`));
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Category:** ${cmd.cat}`));
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Syntax:** Use \`a$usage ${cmd.name}\` to see exact usage`));

                    return message.channel.send({
                        components: [container],
                        flags: MessageFlags.IsComponentsV2
                    });
                }

                const categoryCmds = allCommands.filter(c => c.cat === query);
                if (categoryCmds.length > 0) {
                    const container = new ContainerBuilder().setAccentColor(null);
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Axgard Help • ${query.charAt(0).toUpperCase() + query.slice(1)}**`));
                    container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

                    categoryCmds.forEach(cmd => {
                        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**a$${cmd.name}**\n> ${cmd.desc}`));
                    });

                    return message.channel.send({
                        components: [container],
                        flags: MessageFlags.IsComponentsV2
                    });
                }
            }

            // Default full help with pagination (your original system)
            let currentCategory = 'all';
            let currentPage = 0;
            const perPage = 8;

            const getFiltered = () => 
                currentCategory === 'all' 
                    ? allCommands 
                    : allCommands.filter(c => c.cat === currentCategory);

            const generateContainer = (page) => {
                const filtered = getFiltered();
                const start = page * perPage;
                const cmds = filtered.slice(start, start + perPage);

                const container = new ContainerBuilder().setAccentColor(null);

                const title = currentCategory === 'all' 
                    ? `**Axgard Help • All Commands** (${totalCommands} total)` 
                    : `**Axgard Help • ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}**`;

                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(title));
                container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

                cmds.forEach(cmd => {
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**a$${cmd.name}**\n> ${cmd.desc}`));
                });

                const totalPages = Math.ceil(filtered.length / perPage) || 1;
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Page ${page + 1} / ${totalPages}**`));

                return container;
            };

            const buttonRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('help_prev').setLabel('Previous').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('help_next').setLabel('Next').setStyle(ButtonStyle.Secondary)
            );

            const menuRow = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_category')
                    .setPlaceholder('Switch category...')
                    .addOptions([
                        { label: 'All Commands', value: 'all', default: currentCategory === 'all' },
                        { label: 'Moderation', value: 'moderation', default: currentCategory === 'moderation' },
                        { label: 'Roblox', value: 'roblox', default: currentCategory === 'roblox' },
                        { label: 'Fun', value: 'fun', default: currentCategory === 'fun' },
                        { label: 'Utility', value: 'utility', default: currentCategory === 'utility' },
                        { label: "Veil's Commands", value: 'owner', default: currentCategory === 'owner' }
                    ])
            );

            const initialContainer = generateContainer(currentPage);

            const msg = await message.channel.send({
                components: [initialContainer, buttonRow, menuRow],
                flags: MessageFlags.IsComponentsV2
            });

            const collector = msg.createMessageComponentCollector({
                time: 120000,
                filter: i => i.user.id === message.author.id
            });

            collector.on('collect', async i => {
                try {
                    if (i.customId === 'help_category') {
                        currentCategory = i.values[0];
                        currentPage = 0;
                    } else if (i.customId === 'help_prev') currentPage--;
                    else if (i.customId === 'help_next') currentPage++;

                    const filtered = getFiltered();
                    const totalPages = Math.ceil(filtered.length / perPage) || 1;

                    if (currentPage < 0) currentPage = totalPages - 1;
                    if (currentPage >= totalPages) currentPage = 0;

                    const updatedButtonRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('help_prev').setLabel('Previous').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('help_next').setLabel('Next').setStyle(ButtonStyle.Secondary)
                    );

                    const updatedMenuRow = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('help_category')
                            .setPlaceholder('Switch category...')
                            .addOptions([
                                { label: 'All Commands', value: 'all', default: currentCategory === 'all' },
                                { label: 'Moderation', value: 'moderation', default: currentCategory === 'moderation' },
                                { label: 'Roblox', value: 'roblox', default: currentCategory === 'roblox' },
                                { label: 'Fun', value: 'fun', default: currentCategory === 'fun' },
                                { label: 'Utility', value: 'utility', default: currentCategory === 'utility' },
                                { label: "Veil's Commands", value: 'owner', default: currentCategory === 'owner' }
                            ])
                    );

                    await i.update({
                        components: [generateContainer(currentPage), updatedButtonRow, updatedMenuRow]
                    });
                } catch (err) {
                    if (err.code !== 10062) console.error(chalk.red("[HELP COLLECTOR ERROR]"), err);
                }
            });

            collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));

        } catch (error) {
            console.error(chalk.red("[HELP COMMAND ERROR]"), error);
            message.reply("some shit broke while opening help 💀").catch(() => {});
        }
    }
};
