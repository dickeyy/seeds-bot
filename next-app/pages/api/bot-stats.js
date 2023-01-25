// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const mClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  
  mClient.connect().then(() => {
    const db = mClient.db("main");
  
    db.collection('guilds').find({}).toArray((err, result) => {
      if (err) throw err;

      let userCount = 0;
      result.forEach(guild => {
        userCount += guild.memberCount
      })

      res.status(200).json({
        guilds: result.length,
        users: userCount
      })
    })
  })

  mClient.close();

}
