const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const guildMemberRemoveEvent = async (member) => {

    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) - 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })

    let doc = await coll.findOne({ guildId: member.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.member && doc.toggles.memberEvents.guildMemberRemove) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.member });

            const roles = member.roles.cache.map(role => role.toString()).join(' ')

            const embed = new MessageEmbed()
            .setTitle('Member Left')
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setDescription(`<@${member.user.id}> - Joined at ${member.joinedAt.toLocaleString()}\n\n**ID:** ${member.user.id}}`)

            .addField('Roles', roles || 'None')

            .setFooter({text: "/log toggle member_events Member Leave"})
            .setColor("BLURPLE")
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

exports.guildMemberRemoveEvent = guildMemberRemoveEvent;