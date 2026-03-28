const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'goonmeter',
    execute: async (message, args) => {
        let input = args.join(' ').trim();
        const mentioned = message.mentions.users.first();
        if (mentioned) input = mentioned.username;
        
        if (!input) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$goonmeter <text or @user>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        let percentage = Math.floor(Math.random() * 101);
        let title = "goon meter";
        let description = "";
        let color = 0xFF00FF;

        const lowerInput = input.toLowerCase();

        if (lowerInput === 'axiity' || lowerInput.includes('axiity')) {
            percentage = 10000;
            title = "MAXIMUM GOONER";
            description = "goons to little kids 24/7 (prefers 9 year olds)";
            color = 0xFF0000;
        } 
        else if (lowerInput === 'veil' || lowerInput.includes('veil')) {
            percentage = 69420;
            title = "CERTIFIED GOONER";
            description = "this nigga goonin heavy 🧎‍♂️";
            color = 0xFF00FF;
        } 
        else if (lowerInput === 'path' || lowerInput.includes('path')) {
            percentage = 0;
            title = "ANTI-GOON";
            description = "bro doesn't goon at all 😭";
            color = 0x00FF00;
        } 
        else {
            if (percentage >= 90) {
                description = "this nigga goonin 24/7 🧎‍♂️";
                color = 0xFF00FF;
            } 
            else if (percentage >= 70) {
                description = "heavy gooner";
                color = 0xFF6600;
            } 
            else if (percentage >= 40) {
                description = "average gooner";
                color = 0xFFFF00;
            } 
            else {
                description = "barely goons";
                color = 0x00FF00;
            }
        }

        const container = new ContainerBuilder().setAccentColor(color);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${title}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${input}** is **${percentage}%** gooner`));
        if (description) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};