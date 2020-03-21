var multer  = require('multer')
var upload = multer()

var express = require('express');
var app = express();

exports.testing = (req,res,next)=>{
    // console.log(req.body);
    res.send("req.body");
   
}


exports.temp = (req,res,next)=>{
    console.log(req.body);
    res.send(req.body);
}

exports.data = (req,res,next)=>{
    console.log(req.body);
    res.send(req.body);
}