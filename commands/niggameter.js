const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'niggameter',
    execute: async (message, args) => {
        let input = args.join(' ').trim();
        const mentioned = message.mentions.users.first();
        if (mentioned) input = mentioned.username;
        
        if (!input) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$niggameter <text or @user>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        let percentage = Math.floor(Math.random() * 101);
        let title = "nigga meter";
        let description = "";
        let color = 0xFF0000;

        const lowerInput = input.toLowerCase();

        if (lowerInput === 'veil' || lowerInput.includes('veil')) {
            percentage = 1000000;
            title = "CERTIFIED NIGGA";
            description = "1000000% black, realest nigga alive 🖤";
            color = 0x000000;
        } 
        else if (lowerInput === 'path' || lowerInput.includes('path')) {
            percentage = 0;
            title = "WHITE ASS NIGGA";
            description = "0% black";
            color = 0xFFFFFF;
        } 
        else {
            if (percentage >= 90) {
                description = "certified hood nigga 🖤";
                color = 0x000000;
            } 
            else if (percentage >= 70) {
                description = "pretty gangsta";
                color = 0xFF6600;
            } 
            else if (percentage >= 40) {
                description = "average nigga";
                color = 0xFFFF00;
            } 
            else {
                description = "white boy behavior";
                color = 0xFFFFFF;
            }
        }

        const container = new ContainerBuilder().setAccentColor(color);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${title}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${input}** is **${percentage}%** gangsta`));
        if (description) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};