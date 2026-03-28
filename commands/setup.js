const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'setup',
    execute: async (message, args) => {
        if (!message.member.permissions.has('Administrator'))
            return message.reply("you need `Administrator` permission to use setup.");

        const feature = args[0]?.toLowerCase();

        if (!feature || feature !== 'verification') {
            const container = new ContainerBuilder().setAccentColor(0x7289DA);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚙️ Setup**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Available: **verification**`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Usage: \`a$setup verification\``));

            return message.channel.send({ 
                components: [container], 
                flags: MessageFlags.IsComponentsV2 
            });
        }

        const owner = message.author; // Only this person can answer

        await message.channel.send(`**Verification Setup Started**\nOnly <@${owner.id}> can reply.`);

        // Step 1: Verified Role
        const step1 = await message.channel.send("**Step 1/2**\nReply with the **Verified Role** name or ID.\nExample: `verified` or `123456789012345678`");

        const filter = m => m.author.id === owner.id && m.channel.id === message.channel.id;

        let collected = await message.channel.awaitMessages({ filter, max: 1, time: 120000 }).catch(() => null);

        if (!collected || collected.size === 0) {
            return message.channel.send("⏰ Timed out. Run `a$setup verification` again.");
        }

        const verifiedInput = collected.first().content.trim();
        const verifiedRole = resolveRole(message.guild, verifiedInput);

        if (!verifiedRole) {
            return message.channel.send("❌ Could not find that role. Setup cancelled.");
        }

        // Step 2: Unverified Role
        const step2 = await message.channel.send("**Step 2/2**\nReply with the **Unverified Role** name or ID, or type `none`.");

        collected = await message.channel.awaitMessages({ filter, max: 1, time: 120000 }).catch(() => null);

        if (!collected || collected.size === 0) {
            return message.channel.send("⏰ Timed out.");
        }

        const unverifiedInput = collected.first().content.trim();
        let unverifiedRole = null;

        if (unverifiedInput.toLowerCase() !== 'none') {
            unverifiedRole = resolveRole(message.guild, unverifiedInput);
        }

        // Save to database
        try {
            await message.client.db.getDB().execute(`
                CREATE TABLE IF NOT EXISTS server_config (
                    guildId VARCHAR(30) NOT NULL,
                    key_name VARCHAR(50) NOT NULL,
                    value VARCHAR(100) NOT NULL,
                    PRIMARY KEY (guildId, key_name)
                )
            `);

            await message.client.db.getDB().execute(
                `INSERT INTO server_config (guildId, key_name, value) 
                 VALUES (?, 'verified_role', ?) ON DUPLICATE KEY UPDATE value = VALUES(value)`,
                [message.guild.id, verifiedRole.id]
            );

            if (unverifiedRole) {
                await message.client.db.getDB().execute(
                    `INSERT INTO server_config (guildId, key_name, value) 
                     VALUES (?, 'unverified_role', ?) ON DUPLICATE KEY UPDATE value = VALUES(value)`,
                    [message.guild.id, unverifiedRole.id]
                );
            }

            const container = new ContainerBuilder().setAccentColor(0x00FF00);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Verification Setup Complete**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Verified Role:** <@&${verifiedRole.id}>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**Unverified Role:** ${unverifiedRole ? `<@&${unverifiedRole.id}>` : 'None'}`));

            await message.channel.send({ 
                components: [container], 
                flags: MessageFlags.IsComponentsV2 
            });

        } catch (error) {
            console.error("[SETUP ERROR]", error);
            message.channel.send("❌ Database error.");
        }
    }
};

// Stronger role resolver
function resolveRole(guild, query) {
    if (!query) return null;
    query = query.toLowerCase().trim();

    // 1. Try exact ID
    if (/^\d{17,19}$/.test(query)) {
        const role = guild.roles.cache.get(query);
        if (role) return role;
    }

    // 2. Try exact name match first
    let role = guild.roles.cache.find(r => r.name.toLowerCase() === query);
    if (role) return role;

    // 3. Then partial name match (best match by position)
    return guild.roles.cache
        .filter(r => r.name.toLowerCase().includes(query))
        .sort((a, b) => b.position - a.position)[0] || null;
}