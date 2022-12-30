const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const guildMemberAddEvent = async (member) => {
    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) + 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })

    let doc = await coll.findOne({ guildId: member.guild.id })

    if (doc) {
        if (doc.channels.member && doc.toggles.memberEvents.guildMemberAdd) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.member });

            const embed = new MessageEmbed()
            .setTitle('Member Joined')
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setDescription(`<@${member.user.id}> - Member #${Number(member.guild.memberCount).toLocaleString()}\n**ACCT Created:** ${member.user.createdAt.toLocaleString()}\n\n**ID:** ${member.user.id}}`)
            .setFooter({text: "/log toggle member_events Member Join"})
            .setColor('FUCHSIA')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }
}

exports.guildMemberAddEvent = guildMemberAddEvent;