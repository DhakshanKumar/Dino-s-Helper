import fs from 'fs/promises';
import path from 'path';

export async function loadCommands(client) {
    const commandsPath = path.join(process.cwd(), 'commands');

    const files = await fs.readdir(commandsPath);

    for (const file of files) {
        if (!file.endsWith('.js')) continue;

        const command = (await import(`../commands/${file}`)).default;

        client.commands.set(command.data.name, command);

        console.log(`Loaded command: ${command.data.name}`);
    }
}