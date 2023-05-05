const { EmbedBuilder, WebhookClient, time } = require('discord.js');
const { client, db } = require('../index.js')

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
            // remove @everyone
            roles.replace('@everyone', '')

            const embed = new EmbedBuilder()
            .setTitle('Member Left')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064442673806704672.webp')
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setDescription(`<@${member.user.id}> - Joined ${time(member.joinedAt, 'F')}\n\n**ID:** ${member.user.id}`)

            .addFields({name:'Roles', value:roles || 'None'})

            .setFooter({text: "/log toggle member_events Member Leave"})
            .setColor("Blurple")
            .setTimestamp()

            if (!sent) {
                webhookClient.send({
                    avatarURL: client.user.avatarURL(),
                    embeds: [embed]
                })
                sent = true
            }

            webhookClient.destroy()

            // update the data in the database
            await db.collection('guilds').updateOne({ id: member.guild.id }, { $set: { memberCount: member.guild.memberCount } })
        }
    }
}

exports.guildMemberRemoveEvent = guildMemberRemoveEvent;