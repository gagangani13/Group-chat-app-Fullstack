const { GroupUser } = require("../model/groupUser")

module.exports.adminValidate=async(req,res,next)=>{
    const userId=req.userId
    const groupId=req.query.groupId
    const getUser=await GroupUser.findOne({where:{UserId:userId,groupId}})
    if (getUser.admin) {
        req.admin=getUser.admin
        next()
    } else {
        res.send({ok:false,error:`Don't try to Hack !!`})
    }
}