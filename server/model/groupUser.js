const { BOOLEAN, STRING } = require("sequelize");
const database = require("../database/database");

module.exports.GroupUser = database.define("GroupUser", {
  admin: {
    type: BOOLEAN,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  groupName: {
    type: STRING,
    allowNull: false,
  },
});
