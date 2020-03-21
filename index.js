var express = require('express');
var app = express();
var router = express.Router();
const tesing = require('../controllers/abc');
const info = require('../controllers/xyz')
var bodyparser=require('body-parser');
//for file upload
const multer = require('multer');
var upload = multer({ dest: 'uploads/' })

var data = require('../controllers/abc');
const nextFun = require("../controllers/new");
var fs = require('fs');
test = require('../controllers/new');
// express.use(bodyparser.json())

/* GET home page. */
router.post('/',tesing.testing);
router.get('/temp',tesing.temp);
router.put('/data',data.data);




router.post('/profile', upload.single('avatar'), function (req, res) {
  // req.file is the `avatar` file
  res.send('work done');
  // req.body will hold the text fields, if there were any
})


router.get('/new',test.test);


module.exports = router;
