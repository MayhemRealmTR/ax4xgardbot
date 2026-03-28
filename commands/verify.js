const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'verify',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageRoles'))
            return message.reply("you need `Manage Roles` permission to use this command.");

        if (args.length === 0 && message.mentions.members.size === 0) {
            const usage = new ContainerBuilder().setAccentColor(0xFFAA00);
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            usage.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            usage.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$verify <@user> or a$verify <userID>`));
            return message.channel.send({ components: [usage], flags: MessageFlags.IsComponentsV2 });
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target)
            return message.reply("could not find that user.");

        try {
            const [tables] = await message.client.db.getDB().execute(`SHOW TABLES LIKE 'server_config'`);
            if (tables.length === 0) {
                const err = new ContainerBuilder().setAccentColor(0xFF0000);
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Not Configured**`));
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Run \`a$setup verification\` first.`));
                return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
            }

            const [rows] = await message.client.db.getDB().execute(
                `SELECT key_name, value FROM server_config 
                 WHERE guildId = ? AND key_name IN ('verified_role', 'unverified_role')`,
                [message.guild.id]
            );

            if (rows.length === 0) {
                const err = new ContainerBuilder().setAccentColor(0xFF0000);
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Not Configured**`));
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Run \`a$setup verification\` first.`));
                return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
            }

            const config = {};
            rows.forEach(r => config[r.key_name] = r.value);

            if (!config.verified_role) {
                return message.reply("verified role not configured.");
            }

            const verifiedRole = message.guild.roles.cache.get(config.verified_role);
            if (!verifiedRole) {
                return message.reply("verified role no longer exists.");
            }

            if (target.roles.cache.has(verifiedRole.id)) {
                const already = new ContainerBuilder().setAccentColor(0xFFAA00);
                already.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Already Verified**`));
                already.addTextDisplayComponents(new TextDisplayBuilder().setContent(`<@${target.id}> is already verified.`));
                return message.channel.send({ components: [already], flags: MessageFlags.IsComponentsV2 });
            }

            if (verifiedRole.position >= message.guild.members.me.roles.highest.position) {
                const err = new ContainerBuilder().setAccentColor(0xFF0000);
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Hierarchy Error**`));
                err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Verified role is higher than my highest role.`));
                return message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
            }

            await target.roles.add(verifiedRole);

            let removedRole = null;
            if (config.unverified_role) {
                const unverifiedRole = message.guild.roles.cache.get(config.unverified_role);
                if (unverifiedRole && target.roles.cache.has(unverifiedRole.id)) {
                    await target.roles.remove(unverifiedRole);
                    removedRole = unverifiedRole;
                }
            }

            const container = new ContainerBuilder().setAccentColor(0x00FF00);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**✅ Member Verified**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User:** <@${target.id}>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**+** <@&${verifiedRole.id}>`));
            if (removedRole) {
                container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**-** <@&${removedRole.id}>`));
            }
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Verified by <@${message.author.id}>`));

            await message.channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error("[VERIFY ERROR]", error);
            const err = new ContainerBuilder().setAccentColor(0xFF0000);
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Error**`));
            err.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Failed to verify member.`));
            await message.channel.send({ components: [err], flags: MessageFlags.IsComponentsV2 });
        }
    }
};