const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'nuke',
    execute: async (message) => {
        if (!message.member.permissions.has('ManageChannels'))
            return message.reply("you don't have permission to nuke channels");

        // Confirmation system (simple)
        const confirmMsg = await message.reply("⚠️ **NUKE WARNING**\nThis will delete and recreate the channel.\nType `confirm` in 10 seconds to proceed.");

        const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === "confirm";
        const collector = message.channel.createMessageCollector({ filter, time: 10000, max: 1 });

        collector.on('collect', async () => {
            try {
                const oldChannel = message.channel;
                const newChannel = await oldChannel.clone();

                await oldChannel.delete();
                await newChannel.send({
                    content: `✅ Channel has been **nuked** by <@${message.author.id}>`,
                    flags: MessageFlags.IsComponentsV2
                });

            } catch (error) {
                console.error("[NUKE ERROR]", error);
                message.reply("failed to nuke the channel");
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                confirmMsg.edit("Nuke cancelled (no confirmation received).");
            }
        });
    }
};