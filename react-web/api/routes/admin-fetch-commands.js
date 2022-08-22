//functionality of a route

const cmds = require("express").Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Connect to mongo
const MongoUri = 'mongodb+srv://kyledickey:DTD4NjVU3sYhttU@cluster0.j548n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const mClient = new MongoClient(MongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mClient.connect();
const db = mClient.db('main');
console.log('MongoDB Connected')

cmds.get("/admin/fetch-commands", async function (req, res) {
    db.collection('commands').find({}).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        }
    )
});

module.exports = cmds;