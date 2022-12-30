const { MessageEmbed, WebhookClient } = require('discord.js');
const { connectDb } = require('../utils/db.js')
const client = require('../index.js').client

const db = connectDb()

// Colors
const mainHex = '#d79a61'

const coll = db.collection('logSettings')

const roleDeleteEvent = async (role) => {

    let doc = await coll.findOne({ guildId: role.guild.id })

    if (doc) {
        if (doc.channels.server && doc.toggles.serverEvents.roleDelete) {

            const webhookClient = new WebhookClient({ url: doc.webhookUrls.server });

            const embed = new MessageEmbed()
            .setTitle('Role Deleted')
            .setDescription(`**Role:** ${role.name}\n\n**ID:** ${role.id}`)
            .setFooter({text: "/log toggle server_events Role Delete"})
            .setColor('#FA8A87')
            .setTimestamp()

            webhookClient.send({
                avatarURL: client.user.avatarURL(),
                embeds: [embed]
            })

            webhookClient.destroy()
        }
    }

}

exports.roleDeleteEvent = roleDeleteEvent;