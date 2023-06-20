const { INTEGER, STRING } = require('sequelize')
const database=require('../database/database')
module.exports.Group=database.define('group',{
    id:{
        type:INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    groupName:{
        type:STRING,
        allowNull:false
    }
})