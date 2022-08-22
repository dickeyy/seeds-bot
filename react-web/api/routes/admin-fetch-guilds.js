//functionality of a route

const guilds = require("express").Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Connect to mongo
const MongoUri = 'mongodb+srv://kyledickey:DTD4NjVU3sYhttU@cluster0.j548n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const mClient = new MongoClient(MongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mClient.connect();
const db = mClient.db('main');
console.log('MongoDB Connected')

guilds.get("/admin/fetch-guilds", async function (req, res) {
    db.collection('guilds').find({}).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        }
    )
});

module.exports = guilds;