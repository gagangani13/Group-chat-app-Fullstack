const { Op, Sequelize } = require("sequelize");
const database = require("../database/database");
const { Group } = require("../model/group");
const { GroupUser } = require("../model/groupUser");
const { Message } = require("../model/message");
const { User } = require("../model/user");


const createGroup = async (req, res, next) => {
  const t = await database.transaction();
  try {
    const { groupName } = req.body;
    const userId=req.userId
    const getUser = await User.findOne({ where: { id: userId } });
    const userName = getUser.name;
    const createGroup = await Group.create(
      {
        groupName:groupName
      },
      { transaction: t }
    );
    const createGroupUser = await GroupUser.create(
      {
        groupId: createGroup.id,
        UserId: userId,
        admin:true,
        name:userName,
        groupName:groupName
      },
      { transaction: t }
    );
    const message = await Message.create(
      {
        name: 'Admin',
        messages: `${userName} created this group`,
        UserId: userId,
        groupId: createGroup.id,
      },
      { transaction: t }
    );
    await t.commit();
    res.send({ ok: true });
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.send({ ok: false, error: error.message });
  }
};

const joinGroup=async(req,res,next)=>{
    const t=await database.transaction();
    try {
        const particId=Number(req.body.participantId)
        const groupId=Number(req.query.groupId)
        const getGroup=await Group.findOne({where:{id:groupId},transaction:t})
        const getUser=await User.findOne({where:{id:particId}},{transaction:t})
        const addToGroup=await GroupUser.create({
            groupId:groupId,
            UserId:getUser.id,
            name:getUser.name,
            groupName:getGroup.groupName
        },{transaction:t})
        const createMsg=await Message.create({
            UserId:getUser.id,
            messages:`${getUser.name} is added to this group`,
            name:'Admin',
            groupId:groupId
        },{transaction:t})
        await t.commit();
        res.send({ok:true})
    } catch (error) {
        console.error(error)
        await t.rollback();
        res.send({ok:false,error:'Failed to add participant'})
    }
}

const getGroups=async(req,res,next)=>{
    try {
        const userId=Number(req.userId)
        const getGroups=await GroupUser.findAll({where:{UserId:userId},attributes:['groupName','groupId']})
        res.send({ok:true,groups:getGroups}) 
    } catch (error) {
        console.error(error)
        res.send({ok:false,error:'Error in fetching groups'})
    }
}

const getParticipants=async(req,res,next)=>{
  const t=await database.transaction()
    try {
        const groupId=Number(req.query.groupId)
        const getParticipants=await GroupUser.findAll({where:{groupId:groupId},attributes:['name','UserId','admin'],transaction:t})
        const admin=await GroupUser.findOne({where:{UserId:req.userId,groupId:groupId},attributes:['admin'],transaction:t})
        const addParticipants=await User.findAll({
          where: {
            id: {
              [Op.notIn]: Sequelize.literal(
                `(SELECT \`UserId\` FROM \`GroupUsers\` WHERE \`groupId\` = ${groupId})`
              ),
            },
          },
          attributes:['id','name'],
        transaction:t})
        await t.commit()
        res.send({ok:true,participants:getParticipants,addParticipants,admin:admin.admin}) 
    } catch (error) {
        console.error(error)
        await t.rollback()
        res.send({ok:false,error:'Error in fetching participants'})
    }
}

const makeAdmin=async(req,res,next)=>{
  const particId=Number(req.body.participantId)
  const groupId=Number(req.query.groupId)
  const t=await database.transaction()
  try {
    const getGroupUser= await GroupUser.findOne({where:{UserId:particId,groupId},transaction:t})
    const updateUser=await getGroupUser.update({
      admin:!getGroupUser.admin
    },{transaction:t}) 
    await t.commit()
    res.send({ok:true})
  } catch (error) {
    console.error(error)
    await t.rollback()
    res.send({ok:false,error:'Failed to make admin'})
  }
}

const removeParticipant=async(req,res,next)=>{
  const t=await database.transaction()
  try {
    const particId=Number(req.params.participantId)
    const groupId=Number(req.query.groupId)
    if (!(groupId||particId)) {
      throw new Error();
    }
    const getGroupUser= await GroupUser.findOne({where:{UserId:particId,groupId:groupId}},{transaction:t})
    const removeUser=await getGroupUser.destroy({transaction:t}) 
    const updateMsg=await Message.create({
      name:'Admin',
      messages:`${removeUser.name} is removed from this group`,
      groupId,
      UserId:removeUser.UserId
    },{transaction:t})
    await t.commit()
    res.send({ok:true})
  } catch (error) {
    console.error(error)
    await t.rollback()
    res.send({ok:false,error:'Failed to remove from this group'})
  }

}

module.exports = { createGroup,joinGroup,getGroups,getParticipants,makeAdmin,removeParticipant };
