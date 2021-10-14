const { Client, Intents } = require('discord.js');
const { bot_token, status } = require('./config.json');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_MESSAGES]});

client.util = require('./iaBot');

client.on('warn', err => console.warn('[WARNING]', err));

client.on('error', err => console.error('[ERROR]', err));

client.on('messageCreate', (msg) => {
    if (msg.author.bot) return;
    if (msg.guild) {
        client.util.handleTalk(msg);
    }
});

client.on('ready', () => {
    client.util.handleStatus(client, status);
    console.log("[Bouns'IA] Démarré et prêt à discuter !");
});

client.login(bot_token);