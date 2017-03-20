var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var hostname = process.env.HOSTNAME || 'localhost';
var port = 8080;

var db = require('mongoskin').db('mongodb://user:pwd@127.0.0.1:27017/imageDB');

app.get("/", function (req, res) {
      res.redirect("/index.html");
});

app.get("/getList", function (req, res) {
    db.collection("data").find({}).toArray( function(err, result) {
        res.send(JSON.stringify(result));
    });
});

app.get("/addImage", function (req, res) {
    db.collection("data").insert(req.query, function(err, result) {
        if (err){
            res.send("error");
        } 
        else {
            db.collection("data").find({}).toArray( function(err1, result1) {
                res.send(JSON.stringify(result1));
            });
        }
    });
});

app.get("/displayImage", function (req, res) {
    var id = req.query.id.toString();
    db.collection("data").find({id: id}).toArray( function(err, result) {
        res.send(JSON.stringify(result));
    });
});

app.get("/deleteImage", function (req, res) {
    var id = req.query.id.toString();
    db.collection("data").remove({id: id}, function(err, result) {
        if (err) {
            res.send("error");
        } 
        else {
            db.collection("data").find({}).toArray( function(err1, result1) {
                res.send(JSON.stringify(result1));
            });
        }
    });
});

app.get("/rename", function (req, res) {
    var id = req.query.id.toString();
    var title = req.query.title.toString();
    db.collection("data").update({id: id}, { $set: { title: title } }).toArray( function(err, result) {
        res.send(JSON.stringify(result));
    });
});

app.get("/editDesc", function (req, res) {
    var id = req.query.id.toString();
    var desc = req.query.desc.toString();
    db.collection("data").update({id: id}, { $set: { desc: desc } }).toArray( function(err, result) {
        res.send(JSON.stringify(result));
    });
});

app.get("/editURL", function (req, res) {
    var id = req.query.id.toString();
    var imageURL = req.query.imageURL.toString();
    db.collection("data").update({id: id}, { $set: { imageURL: imageURL } }).toArray( function(err, result) {
        res.send(JSON.stringify(result));
    });
});

app.use(methodOverride()); 
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);