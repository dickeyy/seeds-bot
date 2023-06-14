const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { log } = require('./functions/log');

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)

    log('error', error.stack)
});

// Permission Integers
const BAN_MEMBERS_PERM = 0x0000000000000004
const KICK_MEMBERS_PERM = 0x0000000000000002
const ADMIN_PERM = 0x0000000000000008
const MODERATE_PERM = 0x0000010000000000

// Write Command Definitions
const commands = [

    { 
        name: 'help', 
        description: 'Get a list of all Seeds commands' 
    },

    // Moderation Commands
    { 
        name: 'ban', 
        description: 'Ban a member from the server', 
        default_member_permissions: BAN_MEMBERS_PERM, 
        options: [
            { 
                name: 'user',
                description: 'The person you want to ban', 
                required: true, 
                type: ApplicationCommandOptionType.User
            }, 
            { 
                name: 'reason', 
                description: 'The reason the person is being banned', 
                required: false, 
                type: ApplicationCommandOptionType.String 
            },
            {
                name: 'delete_hours',
                description: 'The amount of hours of messages to delete from the banned user',
                required: false,
                type: ApplicationCommandOptionType.Integer
            }
        ] 
    },
    { 
        name: 'unban', 
        description: 'Unban a previously banned member', 
        default_member_permissions: BAN_MEMBERS_PERM, 
        options: [
            { 
                name: 'user', 
                description: 'The id of the user you want to unban', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            },
            {
                name: 'reason',
                description: 'The reason for the unban',
                required: false,
                type: ApplicationCommandOptionType.String
            }
        ] 
    },
    { 
        name: 'kick', 
        description: 'Kick a member from the server', 
        default_member_permissions: KICK_MEMBERS_PERM, 
        options: [
            { 
                name: 'user', 
                description: 'The person you want to kick', 
                required: true, 
                type: ApplicationCommandOptionType.User 
            }, 
            {
                name: 'reason', 
                description: 'The reason the person is being kicked', 
                required: false, 
                type: ApplicationCommandOptionType.String 
            }
        ] 
    },
    { 
        name: 'warn', 
        description: 'Warn a member in the server', 
        default_member_permissions: MODERATE_PERM, 
        options: [
            { 
                name: 'user', 
                description: 'The person you want to warn', 
                required: true, 
                type: ApplicationCommandOptionType.User 
            }, 
            { 
                name: 'reason', 
                description: 'The reason for the warn', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            }
        ] 
    },
    { 
        name: 'cases', 
        description: 'Check a members cases', 
        default_member_permissions: MODERATE_PERM, 
        options: [
            { 
                name: 'user', 
                description: 'The person whos cases you want', 
                required: true, 
                type: ApplicationCommandOptionType.User 
            }
        ] 
    },
    { 
        name: 'deletecase', 
        description: 'Delete a specific case', 
        default_member_permissions: MODERATE_PERM, 
        options: [
            { 
                name: 'case', 
                description: 'The case ID that you want to delete', 
                required: true, 
                type: ApplicationCommandOptionType.Integer 
            }
        ] 
    },
    { 
        name: 'setreportchannel', 
        description: 'Set a channel to send reports to. This should be a channel that only moderators have access to.', 
        default_member_permissions: MODERATE_PERM, 
        options: [
            { 
                name: 'channel', 
                description: 'The channel you want to set as the report channel', 
                required: true, 
                type: ApplicationCommandOptionType.Channel 
            }
        ] 
    },
    { 
        name: 'report', 
        description: 'Use this to report something to the moderators.', 
        options: [
            { 
                name: 'reason', 
                description: 'The reason for the report', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            }, 
            { 
                name: 'user', 
                description: 'Optionally report a specific user', 
                required: false, 
                type: ApplicationCommandOptionType.User 
            }
        ] 
    },
    {
        name: "log",
        description: "Control the logging system",
        default_member_permissions: MODERATE_PERM,
        options: [
            {
                name: "set_channel",
                description: "Set a log type to a channel",
                type: 1,
                options: [
                    {
                        name: "type",
                        description: "The type of log you want to set",
                        required: true,
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            { name: "Server Logs", value: "server" },
                            { name: "Member Logs", value: "member" },
                            { name: "Message Logs", value: "message" },
                        ]
                    },
                    {
                        name: "channel",
                        description: "The channel you want to set the log to",
                        required: true,
                        type: ApplicationCommandOptionType.Channel
                    }
                ]

            },
            {
                name: "toggle",
                description: "Toggle a log type",
                type: 1,
                options: [
                    {
                        name: "server_events",
                        description: "Toggle specific server events",
                        required: false,
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            { name: "Channel Create", value: "channelCreate" },
                            { name: "Channel Delete", value: "channelDelete" },
                            { name: "Channel Pins Update", value: "channelPinsUpdate" },
                            { name: "Channel Update", value: "channelUpdate" },
                            { name: "Emoji Create", value: "emojiCreate" },
                            { name: "Emoji Delete", value: "emojiDelete" },
                            { name: "Emoji Update", value: "emojiUpdate" },
                            { name: "Member Ban", value: "guildBanAdd" },
                            { name: "Member Unban", value: "guildBanRemove" },
                            { name: "Server Event Create", value: "guildScheduledEventCreate" },
                            { name: "Server Event Delete", value: "guildScheduledEventDelete" },
                            { name: "Server Event Update", value: "guildScheduledEventUpdate" },
                            { name: "Server Update", value: "guildUpdate" },
                            { name: "Invite Create", value: "inviteCreate" },
                            { name: "Invite Delete", value: "inviteDelete" },
                            { name: "Role Create", value: "roleCreate" },
                            { name: "Role Delete", value: "roleDelete" },
                            { name: "Role Update", value: "roleUpdate" },
                            { name: "Sticker Create", value: "stickerCreate" },
                            { name: "Sticker Delete", value: "stickerDelete" },
                            { name: "Sticker Update", value: "stickerUpdate" },
                            { name: "Thread Create", value: "threadCreate" },
                            { name: "Thread Delete", value: "threadDelete" },
                            { name: "Thread Update", value: "threadUpdate" },
                        ]
                    },
                    {
                        name: "member_events",
                        description: "Toggle specific member events",
                        required: false,
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            { name: "Member Join", value: "guildMemberAdd" },
                            { name: "Member Leave", value: "guildMemberRemove" },
                            { name: "Member Update", value: "guildMemberUpdate" },
                        ]
                    },
                    {
                        name: "message_events",
                        description: "Toggle specific message events",
                        required: false,
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            { name: "Message Delete", value: "messageDelete" },
                            { name: "Message Update", value: "messageUpdate" },
                            { name: "Message Bulk Delete", value: "messageDeleteBulk" },
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'purge',
        description: 'Purge types of messages',
        default_member_permissions: MODERATE_PERM,
        options: [
            {
                name: 'all',
                description: 'Purge all messages in the current channel',
                type: 1,
                options: [
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            },
            {
                name: 'user',
                description: 'Purge all messages from a specific user in the current channel',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'The user you want to purge messages from',
                        required: true,
                        type: ApplicationCommandOptionType.User
                    },
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            },
            {
                name: 'bot',
                description: 'Purge all messages from any bot in the current channel',
                type: 1,
                options: [
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            },
            {
                name: 'seeds',
                description: 'Purge all messages from seeds in the current channel',
                type: 1,
                options: [
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            },
            {
                name: 'contains',
                description: 'Purge all messages that contain a specific string in the current channel',
                type: 1,
                options: [
                    {
                        name: 'string',
                        description: 'The string you want to purge messages containing',
                        required: true,
                        type: ApplicationCommandOptionType.String
                    },
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            },
            {
                name: 'embeds',
                description: 'Purge all messages with embeds in the current channel',
                type: 1,
                options: [
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            },
            {
                name: 'emoji',
                description: 'Purge all messages with a specific emoji in the current channel',
                type: 1,
                options: [
                    {
                        name: 'emoji',
                        description: 'The emoji you want to purge messages with',
                        required: true,
                        type: ApplicationCommandOptionType.String
                    },
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            },
            {
                name: 'attachments',
                description: 'Purge all messages with attachments in the current channel',
                type: 1,
                options: [
                    {
                        name: 'amount',
                        description: 'The amount of messages you want to purge',
                        required: true,
                        type: ApplicationCommandOptionType.Integer
                    }
                ]
            }
        ]
    },
    {
        name: 'lockdown',
        description: 'Lockdown the current channel, a specified channel, or the entire server',
        default_member_permissions: MODERATE_PERM,
        options: [
            {
                name: 'channel',
                description: 'Lockdown a specific channel or the current channel',
                required: false,
                type: 1,
                options: [
                    {
                        name: 'channel',
                        description: 'The channel you want to lockdown',
                        required: false,
                        type: ApplicationCommandOptionType.Channel
                    }
                ]
            },
            {
                name: 'server',
                description: 'Lockdown the entire server',
                required: false,
                type: 1,
            }
        ]       
    },
    {
        name: 'unlock',
        description: 'Unlock the current channel or a specified channel',
        default_member_permissions: MODERATE_PERM,
        options: [
            {
                name: 'channel',
                description: 'The channel you want to unlock',
                required: false,
                type: ApplicationCommandOptionType.Channel
            },
        ]
    },
    // Fun Commands
    { 
        name: 'friend', 
        description: 'Talk to an AI friend', 
        options: [
            { 
                name: 'message', 
                description: 'What you want to say to your friend', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            }
        ] 
    },
    { 
        name: 'tsh', 
        description: 'Make a 2 sentence horror story based on a given topic', 
        options: [
            { 
                name: 'topic', 
                description: 'The topic of the horror story', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            }
        ] 
    },
    { 
        name: 'poll', 
        description: 'Send a poll for 2 options in the server', 
        options: [
            { 
                name: 'option1', 
                description: 'First option for the poll', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            }, 
            { 
                name: 'option2', 
                description: 'Second option for the poll', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            }
        ] 
    },
    { 
        name: 'coinflip', 
        description: 'Flip a coin' 
    },
    {
        name: 'lovetest',
        description: 'Test the love between you and another user',
        options: [
            {
                name: 'user',
                description: 'The user you want to test the love with',
                required: true,
                type: ApplicationCommandOptionType.User
            }
        ]
    },
    {
        name: 'todayinhistory',
        description: 'Get a random event that happened on this day in history'

    },
    {
        name: 'weather',
        description: 'Get the weather for a given location',
        options: [
            {
                name: 'location',
                description: 'The location you want to get the weather for',
                required: true,
                type: ApplicationCommandOptionType.String
            }
        ]
    },
    {
        name: 'game',
        description: 'Choose from a variety of games to play',
        options: [
            {
                name: 'tictactoe',
                description: 'Play a game of tictactoe',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'Who you want to play against',
                        required: true,
                        type: ApplicationCommandOptionType.User
                    }
                ]
            }
        ]
    },

    // Economy Commands
    { 
        name: 'balance', 
        description: 'Check you SeedCoin balance' 
    },
    { 
        name: 'beg', 
        description: 'Beg Seeds for some coins (has varrying results)' 
    },
    { 
        name: 'daily', 
        description: 'Claim your daily SeedsCoin' 
    },
    { 
        name: 'highlow', 
        description: 'Guess if a secret number is higher or lower than another, guess right and get some SeedCoin' 
    },
    { 
        name: 'slots', 
        description: 'Bet some coins in the slot machine', 
        options: [
            { 
                name: 'bet', 
                description: 'How much you want to bet, must be more than 10', 
                required: true, 
                type: ApplicationCommandOptionType.Integer 
            }
        ] 
    },
    { 
        name: 'rps', 
        description: 'Play Seeds in a game of rock paper scissors', 
        options: [
            { 
                name: 'bet', 
                description: 'How much you want to bet ont the game', 
                required: true, 
                type: ApplicationCommandOptionType.Integer 
            }, 
            { 
                name: 'move', 
                description: 'The move for the game (either rock, paper, or scissors)', 
                required: true, 
                type: ApplicationCommandOptionType.String, 
                choices: [
                    { 
                        name: 'rock', 
                        value: 'rock' 
                    }, 
                    { 
                        name: 'paper', 
                        value: 'paper' 
                    }, 
                    { 
                        name: 'scissors', 
                        value: 'scissors' 
                    }
                ] 
            }
        ] 
    },
    { 
        name: 'shop', 
        description: 'See items that are avaliable for purchase' 
    },
    { 
        name: 'buy', 
        description: 'Buy something from the shop', 
        options: [
            { 
                name: 'id', 
                description: 'The shop id number, get this using /shop', 
                required: true, 
                type: ApplicationCommandOptionType.Integer 
            }
        ] 
    },
    { 
        name: 'fish', 
        description: 'Cast your pole out and hope for a bite' 
    },
    { 
        name: 'vote', 
        description: 'Vote for Seeds on top.gg and get 1000 SeedCoins' 
    },
    { 
        name: 'mine', 
        description: 'Use your pickaxe to find some ore and get some coins. (Watch for lava)' 
    },

    // Utility Commands
    { 
        name: 'stats', 
        description: 'Get some cool stats about the bot' 
    },
    { 
        name: 'rcolor', 
        description: 'Generate a random color (with hex code)' 
    },
    { 
        name: 'botidea', 
        description: 'Suggest an idea to the devs (Your idea is publicly viewed and voted on in the support server)', 
        options: [
            { 
                name: 'idea', 
                description: 'The idea you want to suggest', 
                required: true, 
                type: ApplicationCommandOptionType.String 
            }
        ] 
    },
    {
        name: 'qr',
        description: 'Generate a QR code for a given URL',
        options: [
            {
                name: 'url',
                description: 'The URL you want to generate a QR code for',
                required: true,
                type: ApplicationCommandOptionType.String
            }
        ]
    },
    {
        name: 'alert',
        description: 'View active alerts from the developers'
    },
    // {
    //     name: 'starboard',
    //     description: 'Configure the starboard for the server',
    //     default_member_permissions: MODERATE_PERM,
    //     options: [
    //         {
    //             name: 'set',
    //             description: 'Set settings for the starboard',
    //             required: false,
    //             type: 1,
    //             options: [
    //                 {
    //                     name: 'channel',
    //                     description: 'The channel to set the starboard to',
    //                     required: true,
    //                     type: ApplicationCommandOptionType.Channel
    //                 },
    //                 {
    //                     name: 'emoji',
    //                     description: 'The emoji you want to require users to react with to star a message',
    //                     required: true,
    //                     type: ApplicationCommandOptionType.String
    //                 },
    //                 {
    //                     name: 'amount',
    //                     description: 'The amount of stars a message needs to be added to the starboard',
    //                     required: true,
    //                     type: ApplicationCommandOptionType.Integer
    //                 }
    //             ]

    //         },
    //         {
    //             name: 'disable',
    //             description: 'Disable the starboard',
    //             required: false,
    //             type: 1
    //         },
    //     ]
    // }
    // Level Commands
    // {
    //     name: 'rank', 
    //     description: 'Check your rank in the server',
    //     options: [
    //         {
    //             name: 'user',
    //             description: 'The user you want to check the rank of',
    //             required: false,
    //             type: ApplicationCommandOptionType.User
    //         }
    //     ]
    // },
    // {
    //     name: 'levels',
    //     description: 'Edit the level settings for the server',
    //     default_member_permissions: MODERATE_PERM,
    //     options: [
    //         {
    //             name: 'toggle',
    //             description: 'Toggle the levels / xp system for the server',
    //             required: false,
    //             type: 1,
    //         },
    //         {
    //             name: 'settings',
    //             description: 'View the settings for the server',
    //             required: false,
    //             type: 1,
    //         }
    //     ]
    // }

]

exports.commands = commands