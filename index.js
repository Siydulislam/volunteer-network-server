const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hniul.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

app.get('/', (req, res) =>{
  res.send("Hello, how are you doing?")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db(process.env.DB_NAME).collection("events");
  const registrationCollection = client.db(process.env.DB_NAME).collection("registration");
  console.log('database connected');

  app.post('/addEvent', (req, res) => {
      const event = {
        title: req.body.name,
        img: req.body.name
      }
      eventsCollection.insertOne(event)
      .then(result => {
          res.send(result);
      })
  })

  app.get('/events', (req, res) => {
    eventsCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents);
    })
  })

  app.post('/registration', (req, res) => {
      const registration = req.body;
      registrationCollection.insertOne(registration)
      .then(result => {
          res.send(result);
      })
  })

  app.get('/events/:eventKey', (req, res) => {
    eventsCollection.find({ eventKey: req.params._id})
    .toArray( (err, documents) => {
        res.send(documents[0]);
    })
  })

  app.get('/eventTasks', (req, res) => {
    registrationCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
  })

  app.get('/registerList', (req, res) => {
    registrationCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
  })

  app.delete('/delete/:eventKey', (req, res) => {
    registrationCollection.deleteOne({ eventKey: req.params._id})
    .then(result => {
      res.send(result)
    })
  })

  app.delete('/delete/:registerKey', (req, res) => {
    registrationCollection.deleteOne({ registerKey: req.params._id})
    .then(result => {
      res.send(result)
    })
  })

});

app.listen(process.env.PORT || port);
