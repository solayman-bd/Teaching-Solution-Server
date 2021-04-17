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
  console.log("database connected");

  app.post("/addOrder", (req, res) => {
    const orderDetails = req.body;

    orderCollection.insertOne(orderDetails).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", function (req, res) {
  res.send("hello World");
});

app.listen(process.env.PORT || 5000);
