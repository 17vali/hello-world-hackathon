
const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://hello-world-bot:${config.mongoPassword}@hello-world-bot.cqux6wk.mongodb.net/test`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
})();

