const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Dotenv initialize 
dotenv.config();

// Connect to Mongo
const connectDb = () => {
    try {
        const mClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        mClient.connect().then(() => {
            //
        })
        const db = mClient.db("main");

        return db;
    } catch (err) {
        console.log(err.stack);
    }
};

exports.connectDb = connectDb;