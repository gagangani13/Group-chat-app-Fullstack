const database=require('../database/database');
const { INTEGER, STRING}=require('sequelize')
module.exports.User=database.define('User',{
    id:{
        type:INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    email:{
        allowNull:false,
        unique:true,
        type:STRING
    },
    password:{
        allowNull:false,
        type:STRING
    },
    name:{
        type:STRING,
        allowNull:false
    },
    mobile:{
        type:STRING,
        unique:true,
        allowNull:false
    }
})