const { 
    ContainerBuilder, 
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'translate',
    execute: async (message, args) => {
        const text = args.slice(1).join(' ');
        const targetLang = args[0] || 'en';

        if (!text) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$translate <language> <text>`));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$translate tr hello how are you\``));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        try {
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
            const data = await res.json();

            const translated = data.responseData.translatedText;

            const container = new ContainerBuilder()
                .setAccentColor(0x0099FF);

            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**🌐 Translation**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Original:** ${text}`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Translated (${targetLang}):** ${translated}`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Translation Failed**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Translation service is currently unavailable.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};