const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'pedometer',
    execute: async (message, args) => {
        let input = args.join(' ').trim();
        const mentioned = message.mentions.users.first();
        if (mentioned) input = mentioned.username;
        
        if (!input) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$pedometer <text or @user>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$pedometer veil\``));
            
            return message.channel.send({
                components: [usage],
                flags: MessageFlags.IsComponentsV2
            });
        }

        let percentage;
        let title = "pedo meter";
        let description = "";
        let color = 0xFF00FF;

        const lowerInput = input.toLowerCase();

        // Special cases
        if (lowerInput === 'axiity' || lowerInput.includes('axiity')) {
            percentage = 10000;
            title = "average xraid member";
            description = "god-tier pedophile status";
            color = 0xFF0000;
        } 
        else if (lowerInput === 'kanoyu' || lowerInput.includes('kanoyu') || lowerInput.includes('xkanoyu')) {
            percentage = 69420;
            title = "kanoyu enjoyer";
            description = "goat of pedophilia";
            color = 0xFF00FF;
        } 
        else if (lowerInput === 'veil' || lowerInput.includes('veil')) {
            percentage = 1;
            title = "suspicious";
            description = "why the one tho..";
            color = 0xFF0000;
        } 
        else if (lowerInput === 'path' || lowerInput.includes('path')) {
            percentage = 0;
            title = "NORMAL HUMAN";
            description = "surprisingly not a pedo 😭";
            color = 0x00FF00;
        } 
        else {
            percentage = Math.floor(Math.random() * 101);

            if (percentage >= 90) {
                description = "bros a certified pedophile 💀💀💀💀";
                color = 0xFF0000;
            } 
            else if (percentage >= 70) {
                description = "naw u dangerous";
                color = 0xFF6600;
            } 
            else if (percentage >= 40) {
                description = "u the average pedo";
                color = 0xFFFF00;
            } 
            else {
                description = "surprisingly normal";
                color = 0x00FF00;
            }
        }

        const container = new ContainerBuilder()
            .setAccentColor(color);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**${title}**`)
        );

        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**${input}** is **${percentage}%** pedophile`)
        );

        if (description) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(description)
            );
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};