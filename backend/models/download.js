const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Download = sequelize.define("download", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  file: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Download;
