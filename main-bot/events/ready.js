const client = require('../index.js').client

const readyEvent = function readyEvent() {
    client.user.setActivity('/help', { type: 'LISTENING' }); 
    console.log(`Logged in as: ${client.user.tag}`)
}

exports.readyEvent = readyEvent;