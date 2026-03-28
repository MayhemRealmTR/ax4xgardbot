const { MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'robloxavatar',
    execute: async (message, args) => {
        const username = args.join(' ').trim();
        if (!username) {
            return message.reply("provide a Roblox username.\nExample: `a$robloxavatar builderman`");
        }

        const loadingMsg = await message.channel.send(`🔍 **Fetching full avatar for ${username}...**`);

        try {
            // Get User ID
            const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    usernames: [username], 
                    excludeBannedUsers: false 
                })
            });

            const userData = await userRes.json();

            if (!userData.data || userData.data.length === 0) {
                return loadingMsg.edit(`❌ User **${username}** not found.`);
            }

            const userId = userData.data[0].id;

            // Full body avatar URL (the one that actually works)
            const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=720x720&format=Png&isCircular=false`;

            // Get the real image URL from JSON
            const thumbRes = await fetch(avatarUrl);
            const thumbData = await thumbRes.json();

            let finalUrl = avatarUrl; // fallback
            if (thumbData.data && thumbData.data[0] && thumbData.data[0].imageUrl) {
                finalUrl = thumbData.data[0].imageUrl;
            }

            await loadingMsg.delete().catch(() => {});

            // Send as proper embed (clean look)
            const embed = new EmbedBuilder()
                .setTitle(`${username}'s Roblox Avatar`)
                .setImage(finalUrl)
                .setColor(0x00B0F4)
                .setFooter({ text: `Requested by ${message.author.tag}` });

            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error("[ROBLOXAVATAR ERROR]", error);
            await loadingMsg.edit("❌ Failed to fetch avatar. Roblox API might be slow or down.");
        }
    }
};