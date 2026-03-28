const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'botclear',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply("you don't have permission to delete messages.");
        }

        let amount = parseInt(args[0]) || 15;
        if (amount < 1) amount = 15;
        if (amount > 100) amount = 100;

        const loadingMsg = await message.channel.send(`🧹 **Clearing last ${amount} bot messages...**`);

        let deletedCount = 0;

        try {
            const fetched = await message.channel.messages.fetch({ limit: 100 });
            const botMessages = fetched.filter(m => m.author.id === message.client.user.id).first(amount);

            if (botMessages.size > 0) {
                await message.channel.bulkDelete(botMessages, true);
                deletedCount = botMessages.size;
            }

            const container = new ContainerBuilder()
                .setAccentColor(0xFF0000);

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**🧹 Bot Messages Cleared**`)
            );

            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
            );

            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`Successfully deleted **${deletedCount}** bot messages.`)
            );

            const successMsg = await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

            setTimeout(() => successMsg.delete().catch(() => {}), 3000);

        } catch (error) {
            console.error("[BOTCLEAR ERROR]", error);
            await loadingMsg.edit("❌ Failed to clear bot messages.");
        }
    }
};