const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.json());
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zrru5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const usersCollection = client.db('coffeeDB').collection('users');

    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee)
      // send data to mongodb
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
          category: updatedCoffee.category,
          quantity: updatedCoffee.quantity,
          taste: updatedCoffee.taste,
          supplier: updatedCoffee.supplier
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })
    // get users
    app.get('/users', async(req,res)=>{
      const cursor = usersCollection.find();
      const result = await cursor.toArray()
      res.send(result)

    })
    // create user
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hellow from coffee server')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})