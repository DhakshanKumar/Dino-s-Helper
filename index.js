import 'dotenv/config';
import {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes
} from 'discord.js';

import { loadCommands } from './utils/loadCommands.js';
import handleInteraction from './events/interactionCreate.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
client.activeConnections = new Map();

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        {
            body: [...client.commands.values()].map(cmd =>
                cmd.data.toJSON()
            )
        }
    );

    console.log(
        `Registered ${client.commands.size} global commands`
    );
});

client.on('interactionCreate', interaction =>
    handleInteraction(interaction, client)
);

async function start() {
    await loadCommands(client);

    console.log(`Loaded ${client.commands.size} commands`);

    await client.login(process.env.TOKEN);
}

start().catch(console.error);