const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'usage',
    execute: async (message, args) => {
        if (!args[0]) {
            const container = new ContainerBuilder().setAccentColor(0xFFAA00);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠️ Usage**`));
            container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`a$usage <command>`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`Example: \`a$usage warn\``));
            return message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        const cmdName = args[0].toLowerCase();
        const command = message.client.commands.get(cmdName);

        if (!command) {
            const container = new ContainerBuilder().setAccentColor(0xFF0000);
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**❌ Command Not Found**`));
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`No command named **${cmdName}** exists.`));
            return message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        }

        let usageText = "No detailed usage available for this command.";

        // Detailed usage for every command
        switch (cmdName) {
            case 'warn':
                usageText = "a$warn @user [reason]";
                break;
            case 'blacklist':
                usageText = "a$blacklist @user [reason]";
                break;
            case 'unblacklist':
                usageText = "a$unblacklist @user [reason]";
                break;
            case 'kick':
                usageText = "a$kick @user [reason]";
                break;
            case 'mute':
                usageText = "a$mute @user [time] [reason]\nExample: a$mute @veil 1h spam";
                break;
            case 'unmute':
                usageText = "a$unmute @user [reason]";
                break;
            case 'verify':
                usageText = "a$verify @user";
                break;
            case 'nick':
                usageText = "a$nick @user <new nickname>";
                break;
            case 'role':
                usageText = "a$role <role1,role2,...> <user>\nExample: a$role owner,mod @veil";
                break;
            case 'rolecolor':
                usageText = "a$rolecolor <role> <hex>\nExample: a$rolecolor mod #ff00ff";
                break;
            case 'roleabove':
                usageText = "a$roleabove <role1> <role2>";
                break;
            case 'rolehoist':
                usageText = "a$rolehoist <role> <true/false>";
                break;
            case 'removerole':
                usageText = "a$removerole <role>";
                break;
            case 'slowmode':
                usageText = "a$slowmode <seconds> or 0 to disable";
                break;
            case 'timestamp':
                usageText = "a$timestamp <time>\nExample: a$timestamp 2h 30m or a$timestamp now";
                break;
            case 'translate':
                usageText = "a$translate <language> <text>\nExample: a$translate tr hello how are you";
                break;
            case 'qrcode':
                usageText = "a$qrcode <text or link>";
                break;
            case 'base64':
                usageText = "a$base64 encode <text>\na$base64 decode <base64>";
                break;
            case 'calc':
                usageText = "a$calc <expression>\nExample: a$calc 2 + 3 * 5";
                break;
            case 'remind':
                usageText = "a$remind <time> <reminder>\nExample: a$remind 1h do homework";
                break;
            case 'ship':
                usageText = "a$ship @user1 @user2";
                break;
            case 'pedometer':
            case 'niggameter':
            case 'goonmeter':
            case 'femboymeter':
            case 'cuckmeter':
                usageText = `a$${cmdName} <text or @user>`;
                break;
            case 'setup':
                usageText = "a$setup verification";
                break;
            case 'purge':
                usageText = "a$purge <amount>";
                break;
            case 'botclear':
                usageText = "a$botclear [amount]";
                break;
            case 'lock':
            case 'unlock':
                usageText = `a$${cmdName}`;
                break;
            case 'firstmessage':
                usageText = "a$firstmessage [#channel]";
                break;
            case 'convertuserid':
                usageText = "a$convertuserid <roblox username or user id>";
                break;
            case 'robloxuser':
                usageText = "a$robloxuser <username>";
                break;
            case 'robloxavatar':
                usageText = "a$robloxavatar <username>";
                break;
            default:
                usageText = `a$${cmdName} <arguments>`;
        }

        const container = new ContainerBuilder().setAccentColor(0x7289DA);
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`**📋 Usage for a$${cmdName}**`));
        container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(usageText));

        await message.channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
};