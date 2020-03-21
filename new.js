exports.testing = (req,res)=>{
    console.log(req);
   res.send('we are using next function, no is'+ req.params.id);
}

exports.test = (req,res,next) =>{
    res.send("okk node is working");
}