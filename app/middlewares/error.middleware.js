
const winston=require('winston')

module.exports=function (err,req,res,next) {
    console.log(err);
    
    winston.error(err.message,err)
    //error
    //info
    //warn
    //verbose
    //debug
    //silly
    res.status(500).send({
        status:false,
        message:'something is wrong/failed',
        error:err.message
    })
}