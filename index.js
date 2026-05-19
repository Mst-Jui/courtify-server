const dns = require('node:dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])


const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()


app.use(cors())
app.use(express.json())


const port = process.env.PORT || 5000



// MongoDB start 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("courtify");
    const facilitiesCollection = db.collection("facilities");


    app.get('/facilities', async (req, res) => {
      const result = await facilitiesCollection.find().toArray();
      res.json(result);
    })

    app.get('/facilities/:id', async (req, res) => {
      const { id } = req.params
      const result = await facilitiesCollection.findOne({ _id: new ObjectId(id) }) 
      res.json(result)
    })

    app.post('/facilities', async(req, res)=>{
      const facilitiesData = req.body
      const result = await facilitiesCollection.insertOne(facilitiesData)
      res.json(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongoDB end 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
