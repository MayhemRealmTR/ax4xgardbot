const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'convertuserid',
    execute: async (message, args) => {
        const input = args.join(' ').trim();
        if (!input) return message.reply("provide a Roblox username or User ID.\nExample: `a$convertuserid builderman` or `a$convertuserid 156`");

        const container = new ContainerBuilder().setAccentColor(0x00B0F4);

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🔄 Roblox ID Converter**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));

        try {
            let userId, username;

            // If input looks like a number → treat as User ID
            if (/^\d+$/.test(input)) {
                userId = input;
                const res = await fetch(`https://users.roblox.com/v1/users/${userId}`);
                const data = await res.json();
                
                if (data.errors) {
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`❌ User ID **${userId}** not found.`));
                } else {
                    username = data.name;
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Username:** ${username}`));
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User ID:** ${userId}`));
                }
            } 
            // Else treat as username
            else {
                const res = await fetch('https://users.roblox.com/v1/usernames/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usernames: [input],
                        excludeBannedUsers: false
                    })
                });

                const data = await res.json();

                if (!data.data || data.data.length === 0) {
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`❌ Username **${input}** not found.`));
                } else {
                    userId = data.data[0].id;
                    username = data.data[0].name;
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Username:** ${username}`));
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User ID:** ${userId}`));
                }
            }
        } catch (error) {
            console.error(error);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent("❌ Failed to convert. Roblox API error."));
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};