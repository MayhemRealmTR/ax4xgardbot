const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'purge',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply("you don't have permission to delete messages.");
        }

        let amount = parseInt(args[0]);
        if (!amount || amount < 1) {
            return message.reply("please provide a valid number (1-300).\nExample: `a$purge 100`");
        }

        if (amount > 300) amount = 300;

        const loadingMsg = await message.channel.send(`🧹 **Purging ${amount} messages...**`);

        let deletedCount = 0;

        try {
            let remaining = amount;

            while (remaining > 0) {
                // Fetch more messages each time
                const fetched = await message.channel.messages.fetch({ limit: 100 });

                if (fetched.size === 0) break;

                // Try to bulk delete as many as possible
                const toBulkDelete = fetched.first(Math.min(remaining, fetched.size));

                try {
                    await message.channel.bulkDelete(toBulkDelete, true);
                    deletedCount += toBulkDelete.size;
                    remaining -= toBulkDelete.size;
                } catch (e) {
                    // If bulk delete fails, fall back to individual deletes
                    for (const msg of toBulkDelete.values()) {
                        await msg.delete().catch(() => {});
                        deletedCount++;
                        remaining--;
                        if (remaining <= 0) break;
                        await new Promise(r => setTimeout(r, 600));
                    }
                }

                // Small delay to avoid rate limits
                if (remaining > 0) await new Promise(r => setTimeout(r, 700));
            }

            const container = new ContainerBuilder()
                .setAccentColor(0xFF0000);

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**🧹 Purge Complete**`)
            );

            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
            );

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`Successfully deleted **${deletedCount}** messages.`)
            );
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`By <@${message.author.id}>`)
            );

            const successMsg = await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

            // Auto delete after 4 seconds
            setTimeout(() => successMsg.delete().catch(() => {}), 4000);

        } catch (error) {
            console.error("[PURGE ERROR]", error);
            await loadingMsg.edit("❌ An error occurred while purging messages.");
        }
    }
};