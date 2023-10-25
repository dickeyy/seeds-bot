import { Collection, REST, Routes } from "discord.js";
import { client } from "../bot";
import path from "path";
import { readdirSync } from "fs";
import { logger } from "./logger";
import config from "../config";

const env = config.env;

export default async function registerSlashCommands() {
    client.commands = new Collection();
    const commands:any = [] // this is for registering the commands

    const foldersPath = path.join(__dirname, '../cmds');
    const commandFolders = readdirSync(foldersPath);

    for (const folder of commandFolders) {
        
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

        for (const file of commandFiles) {

            const filePath = path.join(commandsPath, file);
            const command = await import(filePath);

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            client.commands.set(command.data.data.name, command.data);
            commands.push(command.data.data.toJSON());

            // remove the imported command from the cache
            delete require.cache[require.resolve(filePath)];

        }
    }

    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    let eventCount = 0;
    let onceCount = 0;
    let onCount = 0;

    for (const file of eventFiles) {

        const filePath = path.join(eventsPath, file);
        const event = await import(filePath);
        
        if (event.data.once) {
            client.once(event.data.name, (...args) => event.data.execute(...args));
            onceCount++;
        } else {
            client.on(event.data.name, (...args) => event.data.execute(...args));
            onCount++;
        }

        eventCount++;

        // remove the imported event from the cache
        delete require.cache[require.resolve(filePath)];
    }

    logger.info(`Loaded ${eventCount} events (${onceCount} once ${onCount} on).`);

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(config.token as string);
    
    // register the commands
    (async () => {
        try {
            logger.info(`Started refreshing ${commands.length} commands.`);
            let count = 0
            let isPublic = false
    
            // register the commands baed on the environment
            if (env == "dev") {
                const data:any = await rest.put(
                    Routes.applicationGuildCommands(config.appId as string, "1005778938108325970"),
                    { body: commands },
                );
                count = data.length
            } else {
                const data:any = await rest.put(
                    Routes.applicationCommands(config.appId as string),
                    { body: commands },
                );
                count = data.length
                isPublic = true
            }
    
            logger.info(`Successfully reloaded ${count}/${commands.length} ${isPublic ? "Public": "Private"} commands.`);
        } catch (error) {
            logger.error(error);
        }
    })().catch(logger.error);

    return;
}