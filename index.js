const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yctm60s.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const database = client.db("Todo")
    const usersTodo = database.collection("usersTodo")
    const usersCollection = database.collection("users")

    app.post('/createtodo', async(req, res) => {
        const data = req.body
        const result = await usersTodo.insertOne(data)

    })

    app.post('/todouser', async(req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data)
    })

    app.get('/load-todo-content/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email : email};
      const result = await usersTodo.find(query).toArray();
      res.send(result);

    })

    app.get('/todo-details/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await usersTodo.findOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('todo is running')
})

app.listen(port, () => {
    console.log(`Todo running in ${port}`);
})