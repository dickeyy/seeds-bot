const { MessageEmbed, WebhookClient, GuildAuditLogs } = require('discord.js');
const { log } = require('../functions/log.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('starboards')

const messageReactionAddEvent = async (messageReaction, user) => {

    let doc = await coll.findOne({ guildId: messageReaction.message.guild.id })

    let sent = false

    if (doc) {

        if (doc.emoji !== messageReaction.emoji.name) return
        if (messageReaction.count < doc.amount) return

        const webhookClient = new WebhookClient({ url: doc.webhookURL });

        const embed = new MessageEmbed()
        .setAuthor({ name: messageReaction.message.author.tag, iconURL: messageReaction.message.author.avatarURL() })
        .setDescription(messageReaction.message.content)
        if (messageReaction.message.attachments.size > 0) {
            messageReaction.message.attachments.forEach(attachment => {
                embed.setImage(attachment.url)
            })
        }
        embed
        .setColor('GOLD')
        .setFooter({text: `ID: ${messageReaction.message.id}`})

        if (!sent) {
            
            // fetch 100 previous messages from starboard
            const fetch = await client.channels.cache.get(doc.channelId).messages.fetch({ limit: 100 })

            const stars = fetch.find(m => {
                m.embeds[0]?.footer?.text.split(' ')[1] === messageReaction.message.id
            })

            if (stars) {
                embed.setTitle(`${doc.emoji} ${messageReaction.count} - #${messageReaction.message.channel.name}`)
                const starMsg = await client.channels.cache.get(doc.channelId).messages.fetch(stars.id);
                await starMsg.edit({ embeds: [embed] });
            } else {
                embed.setTitle(`${doc.emoji} ${messageReaction.count} - #${messageReaction.message.channel.name}`)
                await client.channels.cache.get(doc.channelId).send({ embeds: [embed] });
            }


            sent = true
        }

        webhookClient.destroy()
    }

}

exports.messageReactionAddEvent = messageReactionAddEvent;