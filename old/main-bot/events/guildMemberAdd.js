const { EmbedBuilder, WebhookClient, time } = require('discord.js');
const { client, db } = require('../index.js')

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const guildMemberAddEvent = async (member) => {
    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) + 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })

    let doc = await coll.findOne({ guildId: member.guild.id })

    let sent = false

    if (doc) {
        if (doc.channels.member && doc.toggles.memberEvents.guildMemberAdd) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.member });

            const embed = new EmbedBuilder()
            .setTitle('Member Joined')
            .setThumbnail('https://cdn.discordapp.com/emojis/1064442704936828968.webp')
            .setAuthor({ name: member.user.tag, iconURL: member.user.avatarURL() })
            .setDescription(`<@${member.user.id}> - Member #${Number(member.guild.memberCount).toLocaleString()}\n**Acct Created:** ${time(member.user.createdAt, 'R')}\n\n**ID:** ${member.user.id}`)
            .setFooter({text: "/log toggle member_events Member Join"})
            .setColor('Fuchsia')
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

exports.guildMemberAddEvent = guildMemberAddEvent;