var express = require('express');
var router = express.Router();
const tesing = require('../controllers/abc');
const nextFun = require("../controllers/new");
var test = require('../controllers/new');

/* GET home page. */
router.get('/',function(req,res){
  res.send("hello Bareilly");

});


router.get('/sum',function(req,res,next){
    let total=Number(req.query.a)*Number(req.query.b);
    if (total<=25){
    res.json(total);
    }else{
        res.send("value is greater than 25")
        }
});

router.get('/per',function(req,res){
    res.send("what are you saying");

    
});


module.exports = router;