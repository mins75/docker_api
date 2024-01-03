require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express ();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const {MongoClient} = require('mongodb');

const PORT = process.env.PORT || 5000;
const uri = `mongodb://${process.env.IP_ADDRESS}:27017`

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [
      new winston.transports.File({
        filename: 'combined.log',
      }),
      new winston.transports.File({
        filename: 'app-error.log',
        level: 'error',
      }),
    ],
  })

app.post('/', async (req, res) => {
    
    const client = new MongoClient(uri);
    
    const database = client.db("bigdata_api_project");
    const users = database.collection("stocketablissement");
    let message;
    const doc = req.body

    try {
        
        const result = await users.insertOne(doc);
        console.log(result)
        
        if(result.insertedId){
            console.log("insertion successful");
            logger.info(`Document added, SIRET: ${req.body.siret}`);
            message = "Document inserted successfully";
        } else {
            if (!doc.hasOwnProperty('siret', 'siren', 'nic')){
                message = "Failed insertion, document must have 'siret', 'siren' and 'nic' fields"
            }
        }

    }
    catch (e) {
        console.error(e);
        logger.error(e);
        message="Failed insertion, document must have 'siret', 'siren' and 'nic' fields"
    } finally {
        res.send(message)
    }
})

app.delete("/:siret", async (req, res) => {
    const client = new MongoClient(uri);

    const database = client.db("bigdata_api_project");
    const users = database.collection("stocketablissement");

    try {
        const query = { siret: req.params.siret };
        const result = await users.deleteOne(query);
        if(result.acknowledged && (result.deletedCount == 1)){
            res.send("Document deleted successfully")
            logger.info(`Document deleted, SIRET: ${req.params.siret}`)       
        }
        else{
            res.send("Document not found")
            logger.warn(`Document with SIRET: ${req.params.siret} not found for deletion`)
        }
    }
    catch (e){
        console.error(e);
        logger.error(e);
    }

})

app.get("/:siret", async (req, res) => {
    const client = new MongoClient(uri);

    const database = client.db("bigdata_api_project");
    const users = database.collection("stocketablissement");

    

    try {
        const query = { siret : req.params.siret };
        const result = await users.findOne(query);
        console.log(result);
        if(result){
            console.log("search succeful")
            logger.info(`Document retrieved, SIRET: ${req.params.siret}`)
            res.send(result)
        } else {
            res.send({Error: "Unable to find the specified document"})
            logger.warn(`Document with SIRET: ${req.params.siret} not found for retrieval`)
        }    
    }
    catch (e){
        console.error(e);
        logger.error(e);
    }
    finally {
        await client.close();
    }

})


app.put("/:siret", async (req, res) => {
    const client = new MongoClient(uri);

    const database = client.db("bigdata_api_project");
    const users = database.collection("stocketablissement");
    const options = { upsert: false };

    const filter = { siret: req.params.siret }
    let response;
    const updatedDoc = {$set: req.body.update}

    console.log("update", updatedDoc)
    try {
        
        const result = await users.updateOne(filter, updatedDoc, options)
        console.log(result);   
        if (result.matchedCount > 0) {   
            logger.info(`Document updated, SIRET: ${req.params.siret}`)
            response = "Document updated successfully"
        } else {
            logger.warn(`Document with SIRET: ${req.params.siret} not found for update`)
            response = `Document with SIRET: ${req.params.siret} not found for update`
        }
        res.send(response)
    }
    catch (e){
        console.error(e);
        logger.error(e);
    }
    finally {
        await client.close();
    }

})

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });
