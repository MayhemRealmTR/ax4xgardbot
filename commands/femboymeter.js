const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'femboymeter',
    execute: async (message, args) => {
        let input = args.join(' ').trim();
        const mentioned = message.mentions.users.first();
        if (mentioned) input = mentioned.username;
        
        if (!input) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$femboymeter <text or @user>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        let percentage = Math.floor(Math.random() * 101);
        let title = "femboy meter";
        let description = "";
        let color = 0xFF69B4;

        const lowerInput = input.toLowerCase();

        if (lowerInput === 'axiity' || lowerInput.includes('axiity')) {
            percentage = 9999;
            title = "femboy overdrive";
            description = "its 9999 cuz he deserves the 10000 on pedometer";
            color = 0xFF00FF;
        } 
        else if (lowerInput === 'veil' || lowerInput.includes('veil')) {
            percentage = 0;
            title = "masculine nigga";
            description = "damn bro";
            color = 0xFF69B4;
        } 
        else if (lowerInput === 'path' || lowerInput.includes('path')) {
            percentage = 5;
            title = "ANTI-FEMBOY";
            description = "bro is allergic to femboys";
            color = 0x00FF00;
        } 
        else {
            if (percentage >= 90) {
                description = "certified femboy";
                color = 0xFF69B4;
            } 
            else if (percentage >= 70) {
                description = "heavy femboy energy";
                color = 0xFF1493;
            } 
            else if (percentage >= 40) {
                description = "average femboy";
                color = 0xFF69B4;
            } 
            else {
                description = "not a femboy";
                color = 0x00FF00;
            }
        }

        const container = new ContainerBuilder().setAccentColor(color);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${title}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${input}** is **${percentage}%** femboy`));
        if (description) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};