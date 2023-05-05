const { cmdRun } = require('../../functions/cmdRun.js')
const { EmbedBuilder, Permissions } = require('discord.js');
const { log } = require('../../functions/log.js');
const { client, db } = require('../../index.js')

const mainHex = '#d79a61'


exports.starboardSetCmd = async function starboardSetCmd(user,guild,interaction,channel,emoji,amount) {
    const cmdName = 'starboardSet'

    var collection = db.collection('starboards')
    const doc = await collection.findOne({ guildId: guild.id })

    if (doc) {
        const embed = new EmbedBuilder()
        .setTitle('Updated Starboard Settings')
        .setDescription(`Channel: <#${channel.id}>\nEmoji: ${emoji}\nAmount: ${amount}`)
        .setColor(mainHex)

        collection.updateOne({ guildId: guild.id }, { $set: { channelId: channel.id, emoji: emoji, amount: amount } })

        interaction.reply({
            embeds: [embed]
        })

        if (channel.id != doc.channelId) {
            const embed = new EmbedBuilder()
            .setTitle('This is the new starboard channel')
            .setDescription(`Channel: <#${channel.id}>\nEmoji: ${emoji}\nAmount: ${amount}\n\nReact to any message with ${emoji} and if ${amount} other people react, then the message will be posted here for all to see!`)
            .setColor(mainHex)

            client.channels.cache.get(channel.id).send({
                embeds: [embed]
            })
        }

        if (emoji != doc.emoji) {
            const embed = new EmbedBuilder()
            .setTitle('Starboard Emoji Updated!')
            .setDescription(`To add a message to the starboard, you must now react with ${emoji} rather than ${doc.emoji}`)
            .setColor(mainHex)

            client.channels.cache.get(channel.id).send({
                embeds: [embed]
            })
        }

        if (amount != doc.amount) {
            const embed = new EmbedBuilder()
            .setTitle('Starboard Amount Updated!')
            .setDescription(`To add a message to the starboard, ${amount} people must now react rather than ${doc.amount}`)
            .setColor(mainHex)

            client.channels.cache.get(channel.id).send({
                embeds: [embed]
            })
        }
    } else {
        const embed = new EmbedBuilder()
        .setTitle('Set Starboard Settings')
        .setDescription(`Channel: <#${channel.id}>\nEmoji: ${emoji}\nAmount: ${amount}`)
        .setColor(mainHex)

        collection.insertOne({ guildId: guild.id, channelId: channel.id, emoji: emoji, amount: amount })

        interaction.reply({
            embeds: [embed]
        })

        const embed2 = new EmbedBuilder()
        .setTitle('Introducing Starboard!')
        .setDescription('A fun interactive way to show off the best messages in the server.')
        .addFields({name: 'How to use:', value: `React to any message with ${emoji} and if ${amount} total people react, then the message will be posted here for all to see!`})
        .setColor(mainHex)
        .setFooter({ text: 'Enjoy! | Powered by Seeds' })

        client.channels.cache.get(channel.id).send({
            embeds: [embed2]
        })

        channel.createWebhook('Starboard', {
            avatar: client.user.displayAvatarURL()
        }).then(webhook => {
            collection.updateOne({ guildId: guild.id }, { $set: { webhookURL: webhook.url } })
        })

    }

    cmdRun(user,cmdName,guild,interaction)

}