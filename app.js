var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected!");
});
db.on("error", function (err){
  console.log("DB Error : ", err);
});

var dataSchema = mongoose.Schema({
  name : String,
  count : Number
});

var Data = mongoose.model('data', dataSchema);
Data.findOne({name :"myData"}, function(err, data){
  if(err) return console.log("Data Error : " , err);
  if(!data){
    Data.create({name :"myData", count:0}, function (err, data){
      if(err) return console.log("Data Error : ", err);
      console.log("Counter initialized : ", data);
    });
  }
});

app.set("view engine", 'ejs');
app.use(express.static(__dirname + '/public'));

var data={count:0};

app.get('/', function(req,res) {
  data.count++;
  res.render('index', data);
});

app.get('/set/count', function(req, res){
  if(req.query.count) data.count = req.query.count;
  res.render('index', data);
});

app.get('/set/:num', function(req, res){
  data.count = req.params.num;
  res.render('index', data);
});

app.listen(3000, function() {
  console.log('Server on');
});
