const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.08goo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to the "coffeeDB" database and access its "coffees" collection
const coffeeCollection = client.db("coffeeDB").collection("coffees");

// Connect to the "coffeeDB" database and access its "coffees" collection
const userCollection = client.db("userDB").collection("users");


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // All about coffee store users......................................

    // Get all users from database
    app.get('/users', async(req, res) => {
      const users = req.body;
      const result = await userCollection.find().toArray(users);
      res.send(result);
    });

    // Send users to database
    app.post('/users', async(req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // All about coffee store products...................................
    // View a Coffee
    app.get('/view/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      // console.log(query);
      const result = await coffeeCollection.findOne(query);
      res.send(result);

    });
    // Delete a Coffee
    app.delete('/deletecoffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);

    });

    // Get Single Coffee Data
    app.get('/updatecoffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result);
    });

    // Update Single Coffee
    app.put('/updatecoffee/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const coffee = req.body;
      const updateCoffee = {
        $set: {
          name: coffee.name,
          quantity: coffee.quantity,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          phot_url: coffee.phot_url
        }
      }
      const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
      res.send(result);
    });

    // Get All Coffee Data
    app.get('/addcoffee', async(req, res) => {
      const coffees = req.body;
      const result = await coffeeCollection.find().toArray(coffees);
      res.send(result);
    });

    // Add Coffee to Server
    app.post('/addcoffee', async(req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);




app.get('/', (req, res) => {
    res.send('Coffee Server Running on well...');
});


app.listen(port, () => {
    console.log(`App running on Port: ${port}`);
});