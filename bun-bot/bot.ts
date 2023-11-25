import { Client, Collection, Events, GatewayIntentBits, WebhookClient, Options, User } from 'discord.js';
import registerSlashCommands from './lib/registerSlashCommands';
import { db } from './lib/db';
import cmdRun from './lib/cmdRun';
import { redis } from './lib/redis';
import { logger } from './lib/logger';
import config from './config';
import embedBuilder from './lib/embedBuilder';
import { addCooldown, isOnCooldown, tellOnCooldown } from './lib/cooldown';

// import event handlers
// import readyEvent from './events/ready';

// get the environment
const env = config.env;

if (env == "dev") {
    console.log("WARNING: Running in development mode.");
}

// process exceptions
process.on('uncaughtException', (error) => {
    logger.error(error);
});

// handle timeout errors
process.on('unhandledRejection', (error) => {
    logger.error(error);
});

// Client setup
// create a new class that extends Client
class MyClient extends Client {
    commands: Collection<any, any> | undefined;
    webhookClient: WebhookClient | undefined;
    mainColor: string = config.mainColor as string;
}

// create a new MyClient instance
// set the intents
const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.MessageContent,
]
// create the client
const client:MyClient = new MyClient({
    intents: intents, 
    sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3600, // Every hour...
			lifetime: 1800,	// Remove messages older than 30 minutes.
		},
        invites: {
            interval: 3600, // Every hour...
            lifetime: 1800, // Remove invites older than 30 minutes.
        },
    },
});

// register the commands
await registerSlashCommands();

// connect redis
await redis.connect()

redis.on("error", (error) => {
    logger.error("Redis error: " + error);
})

// register the webhook client
const webhookClient = new WebhookClient({ url: config.webhookUrl as string });
client.webhookClient = webhookClient;

// listen for interaction create events
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return

    // get the command from the collection
    const command = client.commands?.get(interaction.commandName);

    // if the command doesn't exist, do nothing
    if (!command) return;

    // try to execute the command
    try {
        
        try {
            command.execute(interaction);
        } catch (error) {
            logger.error("Error executing command: " + error);
            const embedData = {
                title: "Error: An error occured when trying to run this command.",
                description: "Please try again later.",
                color: "Red",
            }
            interaction.reply({ embeds: [ embedBuilder(embedData as any) ], ephemeral: true });
        }

        try {
            cmdRun(interaction.commandName, interaction);
        } catch (error) {
            logger.error("Error running cmdRun: " + error);
        } 

        try {
            await addCooldown(interaction.user, interaction.commandName, interaction.guild as any, 'oneSec');
        } catch (error) {
            logger.error("Error adding cooldown: " + error);
        }
        
    } catch (error) {
        logger.error(error);
        const embedData = {
            title: "Error: An error occured when trying to run this command.",
            description: "Please try again later.",
            color: "Red",
        }
        interaction.reply({ embeds: [ embedBuilder(embedData as any) ], ephemeral: true });
    }
});


// export the client
export { client, db, redis };

// login with the token
client.login(config.token);
