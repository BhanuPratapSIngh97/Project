var express = require('express');
var router = express.Router();
const tesing = require('../controllers/abc');
const nextFun = require("../controllers/new");
/* GET home page. */
router.get('/',function(req,res){
  res.send("hello bhanu");

});

module.exports = router;
