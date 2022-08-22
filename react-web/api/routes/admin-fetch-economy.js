//functionality of a route

const econ = require("express").Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Connect to mongo
function connectDb() {
    const MongoUri = 'mongodb+srv://kyledickey:DTD4NjVU3sYhttU@cluster0.j548n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    const mClient = new MongoClient(MongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    mClient.connect();
    const db = mClient.db('main');
    return db
}

econ.get("/admin/fetch-economy", async function (req, res) {
    const db = connectDb();

    db.collection('economy').find({}).toArray((err, result) => {
            if (err) throw err;
            res.send(result)
        }
    )
});

module.exports = econ;