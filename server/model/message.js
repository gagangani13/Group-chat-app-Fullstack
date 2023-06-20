const { INTEGER, STRING } = require('sequelize')
const database=require('../database/database')
module.exports.Message=database.define('Message',{
    id:{
        type:INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    messages:{
        allowNull:false,
        type:STRING
    },
    name:{
        allowNull:false,
        type:STRING
    },
    groupId:{
        allowNull:false,
        type:INTEGER
    }
})