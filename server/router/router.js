const express=require('express')
const router=express.Router()
const login=require('../controller/login')
const {tokenDecrypt}=require('../middleware/tokenDecrypt')
const forgotPassword  = require('../middleware/forgotPassword')
const message = require('../controller/message')
const group=require('../controller/group')
const { adminValidate } = require('../middleware/adminValidate')

//Login and Signup
router.post('/newUser',login.newUser)
router.post('/loginUser',login.loginUser)

//Forgot password
router.post('/forgotPassword',forgotPassword.forgotPassword,login.forgotPassword)
router.get('/Password/:Id',forgotPassword.validateForgotPasswordLink)
router.post('/updatePassword/:Id',login.updatePassword)

//Messages
router.post('/sendMessage',tokenDecrypt,message.sendMessage)
router.get('/getMessages',tokenDecrypt,message.getMessages)

//Group
router.post('/createGroup',tokenDecrypt,group.createGroup)
router.post('/joinGroup',tokenDecrypt,adminValidate,group.joinGroup)
router.get('/groups',tokenDecrypt,group.getGroups)
router.get('/getParticipants',tokenDecrypt,group.getParticipants)
router.patch('/makeAdmin',tokenDecrypt,adminValidate,group.makeAdmin)
router.delete('/removeParticipant/:participantId',tokenDecrypt,adminValidate,group.removeParticipant)

module.exports=router