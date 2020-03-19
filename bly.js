var express = require('express');
var router = express.Router();
const tesing = require('../controllers/abc');
const nextFun = require("../controllers/new");
/* GET home page. */
router.get('/',function(req,res){
  res.send("hello Bareilly");

});

router.get('/sum',function(req,res){
    let total=Number(req.query.a)/Number(req.query.b);
    res.json(total);

    
});

router.get('/per',function(req,res){
    res.send("hello bhanu How are you");

    
});


module.exports = router;