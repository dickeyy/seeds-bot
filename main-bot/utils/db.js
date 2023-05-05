const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { log } = require('../functions/log');
const mysql = require('mysql2');

// Dotenv initialize 
dotenv.config();

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)

    log('error', error.stack)
});

// Connect to Mongo
const connectDb = () => {
    try {
        const mClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        mClient.connect().then(() => {
            console.log("Connected to MongoDB");
        })
        const db = mClient.db("main");

        return db;
    } catch (err) {
        console.log(err.stack);
    }
};

// Connect to SQL
const connectSql = () => {
    const sql = mysql.createConnection(process.env.SQL_URL)

    return sql;
}

exports.connectSql = connectSql;
exports.connectDb = connectDb;