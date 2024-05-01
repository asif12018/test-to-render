const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//express dot env
require('dotenv').config()
const uri = `mongodb+srv://newUser2:newUser2@cluster0.ekz7tsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//middleware
app.use(cors());
app.use(express.json());

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //setting up collection name and collection
    const itemsCollection = client.db('itemsDB').collection('items');

    //add items to the database
    app.post('/', async (req, res) => {
      const items = req.body;
      // console.log(items);
      const result = await itemsCollection.insertOne(items);
      res.send(result);
    })

    // find all items from database
    app.get('/items', async (req, res) => {
      const cursor = itemsCollection.find();
      // convert cursor to array
      const itemsArray = await cursor.toArray()
      res.send(itemsArray)
    })
    //find specific item by id
    app.get('/items/:id',async(req,res)=>{
       const id = req.params.id;
       //creating a specific query by id
       const query = {_id: new ObjectId(id)}
       const result = await itemsCollection.findOne(query);
      res.send(result);
    })

    //update a specific document
    app.patch('/edit/:id',async(req, res)=>{
       const id = req.params.id;
       const item = req.body;
       //filtering the data 
       const filter = {_id: new ObjectId(id)}
       const updateDoc = {
          $set :{
              photo:item.photo,
              subcategory:item.subcategory,
              description:item.description,
              price:item.price,
              rating: item.rating,
              customize: item.customize,
              process: item.process,
              stock: item.stock,
              itemName: item.itemName
          }
       }
       const result = await itemsCollection.updateOne(filter, updateDoc);
       res.send(result)
      
    })
    //delete function
    app.delete('/delete/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await itemsCollection.deleteOne(query);
        res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('artifex is running ')
})

app.listen(port, () => {
  console.log(`artifex is running in port: ${port}`);
})