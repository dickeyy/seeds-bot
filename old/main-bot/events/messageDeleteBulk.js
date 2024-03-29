const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const messageDeleteBulkEvent = async (messages) => {

    // process the messages. the messages are a collection of messages
    guildId = ''
    authTags = []
    contents = []
    messages.map(message => {
        guildId = message.guild.id
        authTags.push(message.author.tag)
        contents.push(message.content)
    })

    let doc = await coll.findOne({ guildId: guildId })

    let sent = false

    if (doc) {
        if (doc.channels.message && doc.toggles.messageEvents.messageDeleteBulk) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.message });

            let descString = ' '

            for (let i = 0; i < authTags.length; i++) {
                descString += `**- ${authTags[i]}: **${contents[i]}\n`
            }

            const embed = new EmbedBuilder()
            .setTitle(`${contents.length} Messages Purged in #${messages.first().channel.name}`)
            .setThumbnail('https://cdn.discordapp.com/emojis/1064444110334861373.webp')
            .setDescription(`${descString}`)
            .setFooter({text: "/log toggle message_events Message Bulk Delete"})
            .setColor('#373f69')
            .setTimestamp()

            if (!sent) {
                webhookClient.send({
                    avatarURL: client.user.avatarURL(),
                    embeds: [embed]
                })
                sent = true
            }

            webhookClient.destroy()
        }
    }

}

exports.messageDeleteBulkEvent = messageDeleteBulkEvent;