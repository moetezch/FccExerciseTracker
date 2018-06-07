const express=require('express')
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const moment=require('moment')
const URI=process.env.DATABASE

const app=express()
mongoose.connect(URI)
const Schema = mongoose.Schema;
const studentSchema = new Schema({
  name: { type: String, required: true }
});

const exerciceSchema = new Schema({
  description: { type: String, required: true },
  duration:{ type: Number, required: true },
  date:{ type: Date, required: true },
  _user:{type:Schema.Types.ObjectId,ref:'Student'}
});
const Student=mongoose.model('Student',studentSchema)
const Exercice=mongoose.model('Exercice',exerciceSchema)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post('/api/exercise/new-user',async (req,res)=>{

  const student= new Student ({
    name:req.body.username
  })
  await student.save()
  res.send(student)
    

})
app.post('/api/exercise/add',async (req,res)=>{
  const{userId,description,duration,date}=req.body


  const exercice= new Exercice ({
    description,
    duration,
    date,
    _user:userId
  })
  await exercice.save()
  res.send(exercice)
})

app.get('/api/exercise/log/',async (req,res)=>{
  const {userId,start,end,limit}=req.query
  let startDate=new Date(-8640000000000000)
  let endDate=new Date(8640000000000000)
  if (start) {
    startDate=moment(start).toDate()
  }
  if (end) {
    endDate=moment(end).toDate()
  }
  if (mongoose.Types.ObjectId.isValid(userId)) {
    const exerc = await Exercice.find({_user: userId })
    .where('date').gte(startDate).lte(endDate)
    .limit(Number(limit))
    .exec(function(err, exercice) {
      if (err) {
        res.send('exercice not found')
        throw err;
      }
      res.send(exercice)
     })
  } else{
    res.send('user not found ')
  }
})

app.listen(process.env.PORT || 3000);