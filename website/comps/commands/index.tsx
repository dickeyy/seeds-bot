import { useState } from "react"
import Command from "./command"

export default function Commands() {

    const [activeTab, setActiveTab] = useState(1)
    const commands = {
        moderation: [
            {
                name: "ban",
                parameters: {
                    required: [ "user" ],
                    optional: [ "reason", "delete_hours" ]
                },
                short_description: "Bans a user from the server",
                long_description: "Bans a user from the server. If no reason is provided, it will default to \"No reason provided\". If no delete_hours is provided, it will default to 1. Delete hours is how many hours of messages sent from the user, to delete. This command will DM the user with the reason for the ban, and it will create a case with type ban.",
                permission: "BAN_MEMBERS",
            },
            {
                name: "unban",
                parameters: {
                    required: [ "user" ],
                    optional: [ "reason" ]
                },
                short_description: "Unbans a user from the server",
                long_description: "Unbans a user from the server. If no reason is provided, it will default to \"No reason provided\". This command will DM the user with the reason for the unban, and it will create a case with type unban.",
                permission: "BAN_MEMBERS",
            },
            {
                name: "kick", 
                parameters: {
                    required: [ "user" ],
                    optional: [ "reason" ]
                },
                short_description: "Kicks a user from the server",
                long_description: "Kicks a user from the server. If no reason is provided, it will default to \"No reason provided\". This command will DM the user with the reason for the kick, and it will create a case with type kick.",
                permission: "KICK_MEMBERS",
            },
            {
                name: "cases add",
                parameters: {
                    required: [ "user", "reason" ],
                    optional: []
                },
                short_description: "Adds a case to a user",
                long_description: "This command essentially acts as a warn system. It will DM the user for the reason of their warn, and it will create a case with type warn, that any other mod can see later on.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "cases view id",
                parameters: {
                    required: [ "id" ],
                    optional: []
                },
                short_description: "Views a case by its ID",
                long_description: "This command will show you a case by its ID. You can find the ID of a case by using the `/cases view user` command or with the `/cases view latest` command. When users have cases added to them, they are DM'd with the case ID, so they can give it to you as well.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "cases view user",
                parameters: {
                    required: [ "user" ],
                    optional: []
                },
                short_description: "Views a user's cases",
                long_description: "This command will show you all of a user's cases. You can find the user by their ID, or by their mention.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "cases view latest",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Views the latest case",
                long_description: "This command will show you the latest case that was added to the server. This is useful for quickly seeing what the latest case was.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "cases remove id",
                parameters: {
                    required: [ "id" ],
                    optional: []
                },
                short_description: "Removes a case by its ID",
                long_description: "This command will remove a case by its ID. You can find the ID of a case by using the `/cases view user` command or with the `/cases view latest` command. When users have cases added to them, they are DM'd with the case ID, so they can give it to you as well.",
                permission: "MODERATE_MEMBERS",
            }, 
            {
                name: "cases remove user",
                parameters: {
                    required: [ "user" ],
                    optional: []
                },
                short_description: "Removes a user's cases",
                long_description: "This command will remove all of a user's cases. You can find the user by their ID, or by their mention.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "cases remove latest",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Removes the latest case",
                long_description: "This command will remove the latest case that was added to the server. This is useful for quickly removing the latest case if it was added by mistake.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "notes add",
                parameters: {
                    required: [ "user", "content" ],
                    optional: []
                },
                short_description: "Adds a note to a user",
                long_description: "This command will add a note to a user. Notes are only visible to moderators, and they are useful for keeping track of a user's behavior without notifying the user like the cases system does.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "notes view id",
                parameters: {
                    required: [ "id" ],
                    optional: []
                },
                short_description: "Views a note by its ID",
                long_description: "This command will show you a note by its ID. You can find the ID of a note by using the `/notes view user` command or with the `/notes view latest` command.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "notes view user",
                parameters: {
                    required: [ "user" ],
                    optional: []
                },
                short_description: "Views a user's notes",
                long_description: "This command will show you all of a user's notes. You can find the user by their ID, or by their mention.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "notes view latest",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Views the latest note",
                long_description: "This command will show you the latest note that was added to the server. This is useful for quickly seeing what the latest note was.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "notes remove id",
                parameters: {
                    required: [ "id" ],
                    optional: []
                },
                short_description: "Removes a note by its ID",
                long_description: "This command will remove a note by its ID. You can find the ID of a note by using the `/notes view user` command or with the `/notes view latest` command.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "notes remove user",
                parameters: {
                    required: [ "user" ],
                    optional: []
                },
                short_description: "Removes a user's notes",
                long_description: "This command will remove all of a user's notes. You can find the user by their ID, or by their mention.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "notes remove latest",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Removes the latest note",
                long_description: "This command will remove the latest note that was added to the server. This is useful for quickly removing the latest note if it was added by mistake.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "lockdown channel",
                parameters: {
                    required: [],
                    optional: [ "channel" ]
                },
                short_description: "Locks down a channel",
                long_description: "This command will lock down a channel. If no channel is provided, it will lock down the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "lockdown server",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Locks down the server",
                long_description: "This command will lock down the server. This will lock down all channels in the server, and prevent users from sending messages.",
                permission: "MODERATE_MEMBERS",
            }, 
            {
                name: "unlock",
                parameters: {
                    required: [],
                    optional: [ "channel" ]
                },
                short_description: "Unlocks a channel",
                long_description: "This command will unlock a channel. If no channel is provided, it will unlock the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            }, 
            {
                name: "purge all",
                parameters: {
                    required: [ "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges all types of messages from a channel",
                long_description: "This command will purge all types of messages from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "purge user",
                parameters: {
                    required: [ "user", "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges a user's messages from a channel",
                long_description: "This command will purge a user's messages from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            }, 
            {
                name: "purge seeds",
                parameters: {
                    required: [ "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges Seeds' messages from a channel",
                long_description: "This command will purge Seeds' messages from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "purge emoji",
                parameters: {
                    required: [ "emoji", "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges messages containing an emoji from a channel",
                long_description: "This command will purge messages containing an emoji from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "purge contains",
                parameters: {
                    required: [ "string", "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges messages containing a specific text from a channel",
                long_description: "This command will purge messages containing a specific text from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "purge bots",
                parameters: {
                    required: [ "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges messages sent by bots from a channel",
                long_description: "This command will purge messages sent by bots from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            }, 
            {
                name: "purge embeds",
                parameters: {
                    required: [ "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges messages containing embeds from a channel",
                long_description: "This command will purge messages containing embeds from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "purge attachments",
                parameters: {
                    required: [ "amount" ],
                    optional: [ "channel" ]
                },
                short_description: "Purges messages containing attachments from a channel",
                long_description: "This command will purge messages containing attachments from a channel. If no channel is provided, it will purge the channel the command was used in.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "log set channel",
                parameters: {
                    required: [ "channel", "type" ],
                    optional: [ ]
                },
                short_description: "Sets the log channel for a specific type of log",
                long_description: "This command will set the log channel for a specific type of log. Types can either be server, messages, or members.",
                permission: "MODERATE_MEMBERS",
            },
            {
                name: "log toggle",
                parameters: {
                    required: [ "type", "subtype" ],
                    optional: []
                },
                short_description: "Toggles a specific type of log",
                long_description: "This command will toggle a specific type of log. Types can either be server, messages, or members. Subtypes are specific Discord events, such as message delete, message edit, member join, member leave, etc.",
                permission: "MODERATE_MEMBERS",
            }
        ],
        utility: [
            {
                name: "help",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Shows the help menu",
                long_description: "This command will show the help menu. This is the same menu that you are viewing right now.",
                permission: "None"
            },
            {
                name: "user",
                parameters: {
                    required: [],
                    optional: [ "user" ]
                },
                short_description: "Shows a user's information",
                long_description: "This command will show a user's information. If no user is provided, it will show your information.",
                permission: "None"
            },
            {
                name: "poll",
                parameters: {
                    required: [ "options" ],
                    optional: []
                },
                short_description: "Creates a poll",
                long_description: "This command will create a poll. Options must be separated by ||. For example, `/poll option1 || option2 || option3`, up to 8 options are allowed.",
                permission: "None"
            },
            {
                name: "qr",
                parameters: {
                    required: [ "url" ],
                    optional: []
                },
                short_description: "Creates a QR code",
                long_description: "This command will create a QR code. The URL must be a valid URL.",
                permission: "None"
            },
            {
                name: "stats",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Shows the bot's stats",
                long_description: "This command will show the bot's stats. This includes the bot's uptime, the bot's ping, the bot's memory usage, and the bot's CPU usage, etc.",
                permission: "None"
            },
            {
                name: "ping",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Shows the bot's ping",
                long_description: "This command will show the bot's ping. This is useful for seeing if the bot is online.",
                permission: "None"
            }
        ],
        fun: [
            {
                name: "coinflip",
                parameters: {
                    required: [],
                    optional: []
                },
                short_description: "Flips a coin",
                long_description: "This command will flip a coin. It will either land on heads or tails.",
                permission: "None"
            }
        ]
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="tabs tabs-boxed mb-5">
                <a className={`tab ${activeTab == 1 ? "tab-active" : ""}`}
                    onClick={() => {
                        setActiveTab(1)
                    }}
                >Moderation ({commands.moderation.length})</a> 
                <a className={`tab ${activeTab == 2 ? "tab-active" : ""}`}
                    onClick={() => {
                        setActiveTab(2)
                    }}
                >Utility ({commands.utility.length})</a> 
                <a className={`tab ${activeTab == 3 ? "tab-active" : ""}`}
                    onClick={() => {
                        setActiveTab(3)
                    }}
                >Fun ({commands.fun.length})</a>
            </div>

            {activeTab == 1 && (
                <>
                    {commands.moderation.map((command, index) => {
                        return (
                            <Command command={command} key={index} />
                        )
                    })}
                </>
            )}

            {activeTab == 2 && (
                <>
                    {commands.utility.map((command, index) => {
                        return (
                            <Command command={command} key={index} />
                        )
                    })}
                </>
            )}

            {activeTab == 3 && (
                <>
                    {commands.fun.map((command, index) => {
                        return (
                            <Command command={command} key={index} />
                        )
                    })}
                </>
            )}
        </div>
    )
}