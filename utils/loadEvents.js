import fs from "fs/promises";
import path from "path";

export async function loadEvents(client) {
    const eventsPath = path.join(process.cwd(), "events");

    const files = await fs.readdir(eventsPath);

    for (const file of files) {
        if (!file.endsWith(".js")) continue;

        // ❌ SKIP interaction handler (important fix)
        if (file === "interactionCreate.js") {
            console.log(`Skipped event: ${file} (handled manually)`);
            continue;
        }

        const event = (await import(`../events/${file}`)).default;

        if (typeof event === "function") {
            event(client);
        }

        console.log(`Loaded event: ${file}`);
    }
}