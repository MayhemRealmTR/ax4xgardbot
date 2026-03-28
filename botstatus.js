const { ActivityType } = require('discord.js');

// ====================== BOT PRESENCE CONFIG ======================
// Edit this file to change the bot's status, activity, and bio.
// Changes take effect on next bot restart or when reloaded.

module.exports = {

    // Bot status: 'online' | 'idle' | 'dnd' | 'invisible'
    status: 'online',

    // Activity type: 'Playing' | 'Watching' | 'Listening' | 'Competing' | 'Streaming'
    activityType: 'Playing',

    // Activity text (what shows under the bot's name)
    activityText: 'a$help | Axgard',

    // Streaming URL (only used if activityType is 'Streaming')
    streamingUrl: 'https://www.twitch.tv/placeholder',

    // Rotate through multiple statuses? Set to true to enable rotation
    rotate: false,

    // Rotation interval in milliseconds (e.g. 30000 = 30 seconds)
    rotateInterval: 30000,

    // List of statuses to rotate through (only used if rotate is true)
    rotatingStatuses: [
        { type: 'Playing', text: 'a$help | Axgard' },
        { type: 'Watching', text: 'over the server' },
        { type: 'Listening', text: 'a$commands' },
    ],

};

// ====================== APPLY PRESENCE ======================
// This function is called from index.js on bot ready.

const typeMap = {
    'Playing': ActivityType.Playing,
    'Watching': ActivityType.Watching,
    'Listening': ActivityType.Listening,
    'Competing': ActivityType.Competing,
    'Streaming': ActivityType.Streaming,
};

function applyStatus(client) {
    const config = module.exports;

    const setPresence = (type, text) => {
        const actType = typeMap[type] ?? ActivityType.Playing;

        client.user.setPresence({
            status: config.status,
            activities: [{
                name: text,
                type: actType,
                ...(type === 'Streaming' ? { url: config.streamingUrl } : {})
            }]
        });
    };

    if (config.rotate && config.rotatingStatuses.length > 0) {
        let index = 0;

        const tick = () => {
            const current = config.rotatingStatuses[index % config.rotatingStatuses.length];
            setPresence(current.type, current.text);
            index++;
        };

        tick(); // Set immediately
        setInterval(tick, config.rotateInterval);
    } else {
        setPresence(config.activityType, config.activityText);
    }
}

module.exports.applyStatus = applyStatus;