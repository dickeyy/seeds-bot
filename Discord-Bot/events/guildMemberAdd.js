const { connectDb } = require('../utils/db.js');
const { log } = require('../functions/log.js');

const db = connectDb();

const guildMemberAddEvent = async (member) => {
    const collection = db.collection('guilds');
    const guild = await collection.findOne({ _id: member.guild.id })
    const memCout = Number(guild.memberCount) + 1
    await collection.updateOne({ _id: member.guild.id }, { $set: { memberCount: memCout } })
}

exports.guildMemberAddEvent = guildMemberAddEvent;