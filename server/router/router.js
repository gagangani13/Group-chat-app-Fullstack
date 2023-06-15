const express=require('express')
const router=express.Router()
const login=require('../controller/login')
const user=require('../middleware/tokenDecrypt')
const forgotPassword  = require('../middleware/forgotPassword')
//Login and Signup
router.post('/newUser',login.newUser)
router.post('/loginUser',login.loginUser)
//Forgot password
router.post('/forgotPassword',forgotPassword.forgotPassword,login.forgotPassword)
router.get('/Password/:Id',forgotPassword.validateForgotPasswordLink)
router.post('/updatePassword/:Id',login.updatePassword)

module.exports=router