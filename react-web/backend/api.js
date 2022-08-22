const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express()
const apiPort = 2000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

// Connect to mongo
const MongoUri = 'mongodb+srv://kyledickey:DTD4NjVU3sYhttU@cluster0.j548n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const mClient = new MongoClient(MongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mClient.connect();
const db = mClient.db('main');
console.log('MongoDB Connected')

app.get('/', (req, res) => {
    res.send('Hello World')
} )

app.get('/admin/fetch-guilds', (req, res) => {
    db.collection('guilds').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    }
    )
})

app.get('/admin/fetch-commands', (req, res) => {
    db.collection('commands').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    }
    )
})

app.get('/admin/fetch-economy', (req, res) => {
    db.collection('economy').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    }
    )
})

app.listen(apiPort, () => console.log(`http://localhost:${apiPort}`))

// Export the Express API
module.exports = app;