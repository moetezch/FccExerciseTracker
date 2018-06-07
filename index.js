const express=require('express')
const bodyParser = require('body-parser');
const mongo = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectID;
const URI="" // Add your mongo uri here

const app=express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post('/api/exercise/new-user',(req,res)=>{

  mongo.connect(URI, function(err, client) {
    if (err) throw err;
    let db = client.db("fccurl");
    let student = db.collection("students");
    student.insertOne({ name: req.body.username },(err,data)=>{
      if (err) {
        throw err
      } else {
        res.send(data.ops[0])
      }
    });
    client.close();
  });

})
app.post('/api/exercise/add',(req,res)=>{
  const{userId,description,duration,date}=req.body
  mongo.connect(URI, function(err, client) {
    if (err) throw err;
    let db = client.db("fccurl");
    let student = db.collection("students");
    student.updateOne({ _id: ObjectId(userId) },
    { $push: { exercises: { description,duration,date } } },
      (err,data)=>{
      if (err) {
        throw err
      } else {
        res.send(data)
      }
    });
    client.close();
  });
})


app.listen(3000);