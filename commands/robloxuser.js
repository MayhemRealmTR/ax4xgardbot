const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'robloxuser',
    execute: async (message, args) => {
        const username = args.join(' ').trim();
        if (!username) return message.reply("provide a Roblox username.\nExample: `a$robloxuser builderman`");

        const container = new ContainerBuilder().setAccentColor(0xFF4500);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🔍 Roblox User Info**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

        try {
            const res = await fetch('https://users.roblox.com/v1/usernames/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usernames: [username],
                    excludeBannedUsers: false
                })
            });

            const data = await res.json();

            if (!data.data || data.data.length === 0) {
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`❌ User **${username}** not found.`));
            } else {
                const user = data.data[0];
                const detailsRes = await fetch(`https://users.roblox.com/v1/users/${user.id}`);
                const details = await detailsRes.json();

                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${details.displayName}** (@${details.name})`));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User ID:** ${user.id}`));
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Created:** <t:${Math.floor(new Date(details.created).getTime()/1000)}:R>`));
                
                if (details.description) {
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Bio:** ${details.description.substring(0, 180)}${details.description.length > 180 ? '...' : ''}`));
                }
            }
        } catch (error) {
            console.error(error);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ Failed to fetch user data. Roblox API may be slow."));
        }

        await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
    }
};