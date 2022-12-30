const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'
const lightRedHex = '#E75151'

const coll = db.collection('logSettings')

const roleCreateEvent = async (role) => {

    let doc = await coll.findOne({ guildId: role.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.roleCreate) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Role Created')
            .setDescription(`**Role:** ${role.name}\n**Position:** ${role.position}\n\n**ID:** ${role.id}`)
            .setFooter({text: "/log toggle server_events Role Create"})
            .setColor('#A3FA87')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.roleCreateEvent = roleCreateEvent;