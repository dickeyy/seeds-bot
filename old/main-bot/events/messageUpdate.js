const { EmbedBuilder, WebhookClient } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const messageUpdateEvent = async (oldMessage, newMessage) => {

    let sent = false

    let doc = await coll.findOne({ guildId: oldMessage.guild.id })

    if (doc) {
        if (doc.channels.message && doc.toggles.messageEvents.messageUpdate) {

            if (oldMessage.author.bot) return;

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.message });

            const embed = new EmbedBuilder()
            .setTitle(`Message Edited in #${oldMessage.channel.name}`)
            .setThumbnail('https://cdn.discordapp.com/emojis/1065110917962022922.webp')
            .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.avatarURL() })
            .setDescription(`**- Before: **${oldMessage.content}\n**+ After: **${newMessage.content}`)
            .setFooter({text: "/log toggle message_events Message Update"})
            .setColor('#4CA99D')
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

exports.messageUpdateEvent = messageUpdateEvent;