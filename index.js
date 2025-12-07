const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwzwq5a.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    // await client.connect();
    const database = client.db('petService');
    const petService = database.collection('service');
    const ordersCollections = database.collection('orders');
    app.post('/services', async (req, res)=>{
      const data = req.body;
     data.createdAt = new Date();
      console.log(data); 
      const result = await petService.insertOne(data);
      res.send(result); 
    })

      app.get('/services', async (req, res)=>{
      const {category} = req.query
      console.log(category);
      
      const query = {};
      if(category){
        query.category = category;

      }
      const result = await petService.find(query).toArray();
      res.send(result)
     })

     app.get('/services/:id', async(req, res)=>{
       const id = req.params
       console.log(id);

        const query = {_id: new ObjectId(id)}
       const result = await petService.findOne(query)
       res.send(result);
     })
    
    app.post('/orders', async(req, res)=>{
      const data = req.body;
      console.log(data);
      const result = await ordersCollections.insertOne(data);
      res.send(result);
    })
    app.get('/orders', async(req, res)=>{
      const result = await ordersCollections.find().toArray();
      res.status(200).send(result);
    })

    app.get('/myservices', async(req, res)=>{
      const email = req.query.email;
      const query = {email: email};
      const result = await petService.find(query).toArray();
      res.send(result);      
     })

    app.put('/update/:id', async(req, res)=>{
      const data = req.body;
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updateService = {
        $set: data
      }
      const result = await petService.updateOne(query, updateService);
      res.send(result);
     })

      app.delete('/delete/:id', async(req, res)=>{
      const id = req.params
      const query = {_id: new ObjectId(id)}
      const result = await petService.deleteOne(query);
      res.send(result); 
      })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Hello developer')
})

app.listen(port, ()=>{
    console.log(`server is running ${port}`);
    
})
