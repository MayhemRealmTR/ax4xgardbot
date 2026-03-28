const { 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'importemoji',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageGuildExpressions'))
            return message.reply("you need **Manage Server Expressions** permission.");

        const emojiStr = args.join(' ');
        if (!emojiStr) return message.reply("provide emojis to import.\nExample: `a$importemoji :pepega: <:cat:123...>`");

        const emojiRegex = /<a?:(\w+):(\d+)>/g;
        let match;
        const emojis = [];

        while ((match = emojiRegex.exec(emojiStr)) !== null) {
            emojis.push({ name: match[1], id: match[2], animated: emojiStr.includes('<a:') });
        }

        if (emojis.length === 0) return message.reply("no valid emojis found.");

        const imported = [];
        const failed = [];

        for (const emoji of emojis) {
            try {
                const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`;
                const newEmoji = await message.guild.emojis.create({
                    attachment: url,
                    name: emoji.name
                });
                imported.push(newEmoji.toString());
            } catch (err) {
                failed.push(`:${emoji.name}:`);
            }
        }

        const container = new ContainerBuilder()
            .setAccentColor(imported.length > 0 ? 0x00FF00 : 0xFF0000);

        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**📥 Emoji Import Results**`)
        );

        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

        if (imported.length > 0) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`✅ Imported **${imported.length}** emoji(s):\n${imported.join(' ')}`)
            );
        }
        if (failed.length > 0) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`❌ Failed: ${failed.join(' ')}`)
            );
        }

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};