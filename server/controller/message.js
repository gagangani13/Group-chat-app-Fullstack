const database = require("../database/database")
const { Message } = require("../model/message")
const { User } = require("../model/user")

const sendMessage=async(req,res,next)=>{
    const t=await database.transaction()
    try {
        const userName=await User.findOne({where:{id:req.userId}},{transaction:t})
        const createMessage=await Message.create({
            messages:req.body.message,
            name:userName.name,
            UserId:req.userId,
        },{transaction:t}) 
        try { 
            await t.commit()
            res.send({ok:true,message:createMessage})  
        } catch (error) {
            console.log(error);
            throw new Error()
        }
    } catch (error) {
        await t.rollback()
        res.send({ok:false,error:'Not sent'})
    }
}

const getMessages=async(req,res,next)=>{
    try {
        const getMsgs=await Message.findAll({attributes:['name','messages']})
        res.send({ok:true,messages:getMsgs})
    } catch (error) {
        res.send({ok:false,error:'Error in backend'})
    }
}

module.exports={sendMessage,getMessages}