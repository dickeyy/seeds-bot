const { connectDb } = require('../utils/db.js');
const { log } = require('./log.js');

const db = connectDb();

const cmdRun = async (user,cmdName) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var collection = db.collection('commands')
    const doc = await collection.find({ name: cmdName }).toArray();

    var logData = `${date} ${time} | ${user.tag} - ${cmdName}\n`
    await log(logData)

    if (doc.length == 0) {
        const cmdData = {
            name: cmdName,
            runCount: 1
        }
        await collection.insertOne(cmdData)
    } else {
        var runCount = doc[0].runCount
        runCount ++ 

        await collection.updateOne({ name: cmdName }, { $set: { runCount: runCount }})
    }

    console.log(`${date} ${time} | ${user.tag} - ${cmdName}`)
}

exports.cmdRun = cmdRun;