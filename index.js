const  express = require("express")
const app = express()
const rateLimit = require('express-rate-limit');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const Limiter = rateLimit({
    windowMs: 1*60*1000,
    max: 100,
    message: "too much request,plase try again later"

})
app.use(Limiter);
app.get('/',(req,res)=>{
    console.log("hellow docker!")
    res.status(500).json({message:"hellow world",req:req.body});
})
  
app.listen(8000,()=>{
    console.log('backend runing at port 8000')
})