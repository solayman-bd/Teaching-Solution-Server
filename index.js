const express = require("express");
const app = express();
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
app.use(cors());
app.use(express.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzyej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const orderCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("orders");
  const adminCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admin");
  const reviewCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("review");

  app.post("/makeAdmin", (req, res) => {
    const orderDetails = req.body;
    adminCollection.insertOne(orderDetails).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    const orderDetails = req.body;
    orderCollection.insertOne(orderDetails).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/getReview", (req, res) => {
    reviewCollection.find({}).toArray((error, documents) => {
      res.send(documents);
    });
  });
  app.post("/addReview", (req, res) => {
    const orderDetails = req.body;
    reviewCollection.insertOne(orderDetails).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/dashboard", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admins) => {
      if (admins.length === 0) {
        orderCollection
          .find({ email: email })
          .toArray((errors, filteredOrder) => {
            res.send(filteredOrder);
          });
      } else {
        orderCollection.find({}).toArray((error, orders) => {
          res.send(orders);
        });
      }
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });
});

app.get("/", function (req, res) {
  res.send("hello World");
});

app.listen(process.env.PORT || 5000);
