const jwt  = require("jsonwebtoken")
require('dotenv').config()
module.exports.tokenDecrypt=(req,res,next)=>{
    try {
        const tokenId=req.header('Authorization')
        const decode=jwt.verify(tokenId,process.env.JWT_SECRET)
        req.userId=decode
        next()  
    } catch (error) {
        res.send({message:'Token Error'})
    }
}