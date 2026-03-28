const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'slowmode',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageChannels'))
            return message.reply("you don't have permission to manage slowmode");

        const timeInput = args[0] || "0";
        let seconds = 0;

        if (timeInput !== "0") {
            const match = timeInput.match(/^(\d+)(s)?$/i);
            if (!match) {
                const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
                usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
                usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$slowmode <seconds> or 0 to disable`));
                return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
            }
            seconds = parseInt(match[1]);
            if (seconds > 21600) {
                const err = new ContainerBuilder().setAccentColor(0xFF0000);
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Limit Exceeded**`));
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Maximum slowmode is 6 hours (21600 seconds).`));
                return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
            }
        }

        try {
            await message.channel.setRateLimitPerUser(seconds);

            const status = seconds === 0 ? "disabled" : `set to ${seconds} seconds`;
            const color = seconds === 0 ? 0x00FF00 : 0xFFAA00;

            const container = new ContainerBuilder()
                .setAccentColor(color);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⏱️ Slowmode Updated**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Slowmode has been **${status}** in this channel`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`By <@${message.author.id}>`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[SLOWMODE ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Failed to change slowmode.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};