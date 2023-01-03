const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const messageDeleteBulkEvent = async (messages) => {

    // process the messages. the messages are a collection of messages
    guildId = ''
    authId = ''
    authTag = ''
    authAvUrl = ''
    contents = []
    messages.map(message => {
        guildId = message.guild.id
        authId = message.author.id
        authTag = message.author.tag
        authAvUrl = message.author.avatarURL()
        contents.push(message.content)
    })

    let doc = await coll.findOne({ guildId: guildId })

    let sent = false

    if (doc) {
        if (doc.channels.message && doc.toggles.messageEvents.messageDeleteBulk) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.message });

            const embed = new MessageEmbed()
            .setTitle(`Bulk Message Delete in #${messages.first().channel.name}`)
            .setAuthor({ name: authTag, iconURL: authAvUrl })
            .setDescription(`${contents.join('\n')}`)
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