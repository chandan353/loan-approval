const { Sequelize, DataTypes } = require("sequelize");
const customer = require("./customer");
const customer_loan_data = require("./customer_loan_data");
const customer_loan = require("./customer_loan");

const db_connection = {};

db_connection.init = () => {
    const sequelize = new Sequelize(
      process.env.MYSQL_DB,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD,
      {
        host: process.env.MYSQL_HOST,
        logging: false,
        dialect: "mysql",
        dialectOptions: Boolean(process.env.MYSQL_SOCKET) ? {socketPath: "/var/run/mysqld/mysqld.sock"} : {},
        pool: {
          max: 10000,
          min: 0,
          acquire: 60000,
          idle: 1000,
        },
  
        define: {
          underscored: true,
          freezeTableName: true,
          timestamps: true,
        },
      }
    );
  
    sequelize
      .authenticate()
      .then(() => {
        console.log(`DB connected to [${process.env.MYSQL_HOST}:3306]`);
      })
      .catch((err) => {
        console.log("Error" + err);
      });
  
  
    db_connection.Sequelize = Sequelize;
    db_connection.sequelize = sequelize;
    db_connection.customer_model = customer(sequelize, DataTypes);
    db_connection.customer_loan_data_model = customer_loan_data(sequelize, DataTypes);
    db_connection.customer_loan_model = customer_loan(sequelize, DataTypes);



    db_connection.sequelize.sync({ alter: process.env.env != "prod" }).then(() => {
      console.log("re-sync done!");
    });
    return db_connection;
  }
  
  module.exports = db_connection;