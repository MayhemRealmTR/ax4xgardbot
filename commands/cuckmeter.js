const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'cuckmeter',
    execute: async (message, args) => {
        let input = args.join(' ').trim();
        const mentioned = message.mentions.users.first();
        if (mentioned) input = mentioned.username;
        
        if (!input) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$cuckmeter <text or @user>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        let percentage = Math.floor(Math.random() * 101);
        let title = "cuck meter";
        let description = "";
        let color = 0x00FF00;

        const lowerInput = input.toLowerCase();

        if (lowerInput === 'axiity' || lowerInput.includes('axiity')) {
            percentage = 10000;
            title = "MAXIMUM CUCK";
            description = "cucked by veil";
            color = 0xFF0000;
        } 
        else if (lowerInput === 'veil' || lowerInput.includes('veil')) {
            percentage = 0;
            title = "porn star";
            description = "aint ever getting cucked yo";
            color = 0x00FF00;
        } 
        else if (lowerInput === 'path' || lowerInput.includes('path')) {
            percentage = 0;
            title = "ANTI-CUCK";
            description = "bro refuses to be cucked";
            color = 0x00FF00;
        } 
        else {
            if (percentage >= 90) {
                description = "certified cuck 🐂";
                color = 0xFF0000;
            } 
            else if (percentage >= 70) {
                description = "heavy cuck energy";
                color = 0xFF6600;
            } 
            else if (percentage >= 40) {
                description = "average cuck";
                color = 0xFFFF00;
            } 
            else {
                description = "not a cuck";
                color = 0x00FF00;
            }
        }

        const container = new ContainerBuilder().setAccentColor(color);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${title}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${input}** is **${percentage}%** cuck`));
        if (description) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};