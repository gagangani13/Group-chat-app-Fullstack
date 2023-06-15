const express=require('express')
const router=express.Router()
const login=require('../controller/login')
const {tokenDecrypt}=require('../middleware/tokenDecrypt')
const forgotPassword  = require('../middleware/forgotPassword')
const message = require('../controller/message')

//Login and Signup
router.post('/newUser',login.newUser)
router.post('/loginUser',login.loginUser)

//Forgot password
router.post('/forgotPassword',forgotPassword.forgotPassword,login.forgotPassword)
router.get('/Password/:Id',forgotPassword.validateForgotPasswordLink)
router.post('/updatePassword/:Id',login.updatePassword)

//Messages
router.post('/sendMessage',tokenDecrypt,message.sendMessage)
router.get('/getMessages',message.getMessages)

module.exports=router